import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./App.css";
import TopNavbar from "./TopNavbar";
import BottomNavigationBar from "./BottomNavigationBar";
import { makeStyles } from "@mui/styles";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Assicurati che il percorso sia corretto
import { InfoWindow } from "@react-google-maps/api";
import BottomSheet from "./BottomSheet"; // Assicurati che il percorso sia corretto
import NoteCard from "./NoteCard"; // Assicurati che il percorso sia corretto
import { Box } from "@mui/material";

const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
  mapContainer: {
    width: "100vw",
    height: "100vh",
  },
});

const mapStyles = [
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#444444" }],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f2f2f2" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
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
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#46bcec" }, { visibility: "on" }],
  },
];

function Home() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [visibleNotes, setVisibleNotes] = useState([]);
  const mapRef = useRef(null);

  const onMapIdle = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        const visibleNotes = notes.filter((note) => {
          const notePos = new window.google.maps.LatLng(
            note.location.lat,
            note.location.lng
          );
          return bounds.contains(notePos);
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
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function () {
        console.error("Geolocation is not available");
      }
    );
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

  const mapOptions = {
    streetViewControl: false,
    scaleControl: false,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: mapStyles,
  };

  const zoom = 20;

  if (!user) {
    return <div>Verifica della sessione in corso...</div>;
  }

  // Funzione per aprire la bottom sheet
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  // Funzione per chiudere la bottom sheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <div className={classes.container}>
      <TopNavbar />
      <LoadScript googleMapsApiKey="AIzaSyCLMxvG8P-3tdauSGnGM5hETaSwviiILvw">
        <GoogleMap
          mapContainerClassName={classes.mapContainer}
          center={currentPosition}
          zoom={zoom}
          onClick={handleOpenBottomSheet}
          options={mapOptions}
          onLoad={(map) => (mapRef.current = map)}
          onIdle={onMapIdle}
        >
          {notes.map((note, index) => (
            <Marker
              key={index}
              position={{ lat: note.location.lat, lng: note.location.lng }}
              onClick={() => setSelectedNote(note)}
              icon={{
                url: "note-sticky-solid.svg", // Sostituisci con il tuo URL dell'icona SVG
                // Opzionalmente, puoi specificare la dimensione
                scaledSize: new window.google.maps.Size(30, 30), // dimensioni dell'icona
              }}
            />
          ))}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: "location-dot-solid.svg", // Sostituisci con il tuo URL dell'icona SVG
                // Opzionalmente, puoi specificare la dimensione
                scaledSize: new window.google.maps.Size(30, 30), // dimensioni dell'icona
              }}
            />
          )}
          {selectedNote && (
            <InfoWindow
              position={{
                lat: selectedNote.location.lat,
                lng: selectedNote.location.lng,
              }}
              onCloseClick={() => setSelectedNote(null)}
            >
              <div>
                <p>{selectedNote.userName}</p>
                <p>{selectedNote.text}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <BottomNavigationBar />
      <BottomSheet open={isBottomSheetOpen} onClose={handleCloseBottomSheet}>
        <Box sx={{ overflow: "auto", maxHeight: "50vh" }}>
          {visibleNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </Box>
      </BottomSheet>
    </div>
  );
}

export default Home;
