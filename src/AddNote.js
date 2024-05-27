import React, { useState, useEffect } from "react";
import { storage, db, auth } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { TextField, Button, IconButton, Box, Avatar } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Videocam from "@mui/icons-material/Videocam";
import Mic from "@mui/icons-material/Mic";
import Send from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography"; // Aggiungi questa importazione

const Input = styled("input")({
  display: "none",
});

const AddNote = ({ onPublish }) => {
  const [noteData, setNoteData] = useState({
    text: "",
    image: null,
    video: null,
    audio: null,
  });

  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUrl(docSnap.data().profileImageUrl);
        }
      }
    };

    fetchProfileImage();
  }, []);

  // Ottieni il nome dell'utente dall'oggetto auth
  const userName = auth.currentUser ? auth.currentUser.displayName : "Anonimo";
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Ottieni la data e l'ora correnti
  const currentTime = new Date();

  const [location, setLocation] = useState({ lat: null, lng: null });

  // Aggiungi uno stato per tracciare il numero di caratteri
  const [charCount, setCharCount] = useState(0);

  // Modifica handleInputChange per aggiornare il contatore dei caratteri
  const handleInputChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
    if (e.target.name === "text") {
      setCharCount(e.target.value.length);
    }
  };

  const handleFileChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.files[0] });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Errore nell'ottenere la posizione: ", error);
        // Gestisci l'errore
      }
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (location.lat == null || location.lng == null) {
      console.error("Posizione non disponibile.");
      return; // Esci dalla funzione se la posizione non è stata ottenuta
    }

    // Carica i file su Firebase Storage e ottieni gli URL
    const uploadFile = async (file) => {
      if (!file) return null;
      const fileRef = ref(storage, `uploads/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    };

    const imageUrl = await uploadFile(noteData.image);
    const videoUrl = await uploadFile(noteData.video);
    const audioUrl = await uploadFile(noteData.audio);

    // Salva la nota in Firestore
    const docRef = await addDoc(collection(db, "notes"), {
      text: noteData.text,
      image: imageUrl,
      video: videoUrl,
      audio: audioUrl,
      location: location, // Salva la posizione geografica
      userName: userName,
      timestamp: currentTime,
      profileImageUrl: url,
      userId: userId,
      likes: 0,
      comments: [],
    });

    // Resetta lo stato e gestisci post-upload (es. reindirizza o mostra un messaggio)
    setNoteData({ text: "", image: null, video: null, audio: null });
    // Gestisci il successo dell'upload, es. naviga alla homepage o mostra un messaggio di successo

    if (onPublish) {
      onPublish();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 1,
        p: 2,
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{ mr: 1 }}
          src={url || "/path/to/default/profile/picture"}
        />
        <Typography variant="subtitle1">{userName}</Typography>
      </Box>
      <TextField
        name="text"
        value={noteData.text}
        placeholder="Scrivi la tua nota qui"
        multiline
        rows={noteData.image ? 4 : 14}
        variant="outlined"
        fullWidth
        margin="dense"
        maxLength={170}
        onChange={handleInputChange}
        sx={{
          marginBottom: 2,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          paddingRight: 2,
        }}
      >
        {charCount}/170
      </Box>
      {noteData.image && (
        <Box sx={{ position: "relative" }}>
          <img
            src={URL.createObjectURL(noteData.image)}
            alt="uploaded"
            style={{
              width: "40%",
              height: "auto",
              borderRadius: "10px",
              marginTop: "1rem",
            }}
          />
          <Button
            onClick={() => setNoteData({ ...noteData, image: null })}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            Elimina
          </Button>
        </Box>
      )}

      <Box
        style={{ position: "fixed", bottom: 0 }}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "93%",
          alignItems: "center",
          mt: 1,
          mb: 2,
        }}
      >
        <Box>
          <label htmlFor="icon-button-file-image">
            <Input
              accept="image/*"
              id="icon-button-file-image"
              type="file"
              name="image"
              onChange={handleFileChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <label htmlFor="icon-button-file-video">
            <Input
              accept="video/*"
              id="icon-button-file-video"
              type="file"
              name="video"
              onChange={handleFileChange}
            />
            <IconButton
              color="primary"
              aria-label="upload video"
              component="span"
            >
              <Videocam />
            </IconButton>
          </label>
          <IconButton
            color="primary"
            aria-label="record audio"
            component="span"
          >
            <Mic />
          </IconButton>
        </Box>
        <Button variant="contained" endIcon={<Send />} onClick={handleSubmit}>
          Pubblica
        </Button>
      </Box>
    </Box>
  );
};

export default AddNote;
