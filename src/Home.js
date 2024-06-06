import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import TopNavbar from "./TopNavbar";
import BottomNavigationBar from "./BottomNavigationBar";
import Box from "@mui/material/Box";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import BottomSheet from "./BottomSheet";
import NoteCard from "./NoteCard";
import zIndex from "@mui/material/styles/zIndex";

const Container = {
  width: "100%",
  padding: 0,
  margin: 0,
};

const MapContainer = {
  width: "100vw",
  height: "100vh",
};

const mapStyles = [
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#444444" }],
  },

  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
];

const Home = ({ userId, username }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [visibleNotes, setVisibleNotes] = useState([]);
  const mapRef = useRef(null);
  const rangemax = 0.03;
  const isBottomSheetOpenRef = useRef(isBottomSheetOpen);
  const zoom = mapRef.current ? mapRef.current.zoom : 19;
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = { zoom: 19 };
    }
  }, []);

  useEffect(() => {
    isBottomSheetOpenRef.current = isBottomSheetOpen;
  }, [isBottomSheetOpen]);

  const onMapIdle = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        const visibleNotes = notes.filter((note) => {
          const notePos = new window.google.maps.LatLng(
            note.location.lat,
            note.location.lng
          );
          const currentPositionLatLng = new window.google.maps.LatLng(
            currentPosition.lat,
            currentPosition.lng
          );
          let distanceInKm = 0;

          if (
            window.google.maps &&
            window.google.maps.geometry &&
            window.google.maps.geometry.spherical
          ) {
            distanceInKm =
              window.google.maps.geometry.spherical.computeDistanceBetween(
                notePos,
                currentPositionLatLng
              ) / 1000;
          }

          return distanceInKm <= rangemax;
        });
        setVisibleNotes(visibleNotes);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let watchId;

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          // La posizione è stata ottenuta con successo
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // Si è verificato un errore durante l'ottenimento della posizione
          console.error("Errore durante l'ottenimento della posizione", error);
        },
        {
          enableHighAccuracy: true, // Abilita la modalità ad alta precisione
          timeout: 5000, // Imposta un timeout di 5 secondi
          maximumAge: 0, // Non accetta posizioni in cache
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const notesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const newNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(newNotes);
    });

    // Pulisci l'ascoltatore quando il componente si smonta
    return () => unsubscribe();
  }, []);

  const mapOptions = {
    streetViewControl: false,
    scaleControl: false,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: mapStyles,
    gestureHandling: "greedy",
  };

  if (!user) {
    return <div>Verifica della sessione in corso...</div>;
  }

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div style={Container}>
      <TopNavbar />

      <GoogleMap
        mapContainerStyle={MapContainer}
        center={currentPosition}
        zoom={zoom}
        options={mapOptions}
        onLoad={(map) => (mapRef.current = map)}
        onIdle={onMapIdle}
      >
        {notes.map((note, index) => {
          if (note.location && currentPosition) {
            const distance = getDistanceFromLatLonInKm(
              currentPosition.lat,
              currentPosition.lng,
              note.location.lat,
              note.location.lng
            );

            const isWithinRange = distance <= rangemax;

            return (
              <Marker
                key={index}
                position={{
                  lat: note.location.lat,
                  lng: note.location.lng,
                }}
                onClick={() => {
                  if (isWithinRange) {
                    setSelectedNote(note);
                    setIsBottomSheetOpen(true);
                  }
                }}
                icon={{
                  url: isWithinRange
                    ? "note-sticky-solid.svg"
                    : "note-sticky-solid-grey.svg",
                  scaledSize: new window.google.maps.Size(25, 25),
                }}
              />
            );
          }

          return null;
        })}
        {currentPosition && (
          <>
            <Marker
              position={currentPosition}
              icon={{
                url: "location-dot-solid.svg",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
            <Circle
              center={currentPosition}
              radius={rangemax * 1000}
              options={{
                strokeColor: "#40916c",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#d8f3dc",
                fillOpacity: 0.35,
              }}
              onClick={() => {
                setIsBottomSheetOpen(true);
              }}
            />
          </>
        )}
      </GoogleMap>
      <BottomNavigationBar />
      <BottomSheet
        open={isBottomSheetOpen}
        onClose={() => {
          setSelectedNote(null);
          setIsBottomSheetOpen(false);
        }}
      >
        <Box sx={{ overflow: "auto", maxHeight: "80vh" }}>
          {selectedNote && userId ? (
            <NoteCard
              key={selectedNote.id}
              note={selectedNote}
              userId={userId}
              onDelete={() => {
                setSelectedNote(null);
                setIsBottomSheetOpen(false);
              }}
            />
          ) : (
            notes
              .filter((note) => {
                if (note.location && currentPosition) {
                  const distance = getDistanceFromLatLonInKm(
                    currentPosition.lat,
                    currentPosition.lng,
                    note.location.lat,
                    note.location.lng
                  );

                  return distance <= rangemax;
                }

                return false;
              })
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  userId={userId}
                  username={username}
                />
              ))
          )}
        </Box>
      </BottomSheet>
    </div>
  );
};

export default Home;
