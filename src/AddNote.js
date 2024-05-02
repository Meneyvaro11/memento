import React, { useState, useEffect } from 'react';
import { storage, db, auth } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, IconButton, Box, Avatar } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Videocam from '@mui/icons-material/Videocam';
import Mic from '@mui/icons-material/Mic';
import Send from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'; // Aggiungi questa importazione



const Input = styled('input')({
  display: 'none',
});

function AddNote() {
  const [noteData, setNoteData] = useState({
    text: '',
    image: null,
    video: null,
    audio: null
  });

  // Ottieni il nome dell'utente dall'oggetto auth
  const userName = auth.currentUser ? auth.currentUser.displayName : 'Anonimo';

  // Ottieni la data e l'ora correnti
  const currentTime = new Date();
    
  const [location, setLocation] = useState({ lat: null, lng: null });

    const handleInputChange = (e) => {
      setNoteData({ ...noteData, [e.target.name]: e.target.value });
    };
  
    const handleFileChange = (e) => {
      setNoteData({ ...noteData, [e.target.name]: e.target.files[0] });
    };
  

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Errore nell'ottenere la posizione: ", error);
          // Gestisci l'errore
        }
      );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
        const docRef = await addDoc(collection(db, 'notes'), {
          text: noteData.text,
          image: imageUrl,
          video: videoUrl,
          audio: audioUrl,
          location: location, // Salva la posizione geografica
          userName: userName,
          timestamp: currentTime,
        });
        
      
        // Resetta lo stato e gestisci post-upload (es. reindirizza o mostra un messaggio)
        setNoteData({ text: '', image: null, video: null, audio: null });
        // Gestisci il successo dell'upload, es. naviga alla homepage o mostra un messaggio di successo
      };
  
      return (
        <Box sx={{ 
          position: 'relative', 
          borderRadius: 1, 
          p: 2, 
          bgcolor: 'transparent', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2,}}>
          <Avatar sx={{ mr: 1 }} src="/broken-image.jpg" /> {/* Aggiungi qui l'avatar dell'utente */}
          <Typography variant="subtitle1">{userName}</Typography>
          </Box>
          <TextField
            name="text"
            value={noteData.text}
            onChange={handleInputChange}
            placeholder="Scrivi la tua nota qui"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="dense"
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            alignItems: 'center', 
            mt: 1, 
            mb: 2,
          }}>
            <Box>
              <label htmlFor="icon-button-file-image">
                <Input accept="image/*" id="icon-button-file-image" type="file" name="image" onChange={handleFileChange} />
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <label htmlFor="icon-button-file-video">
                <Input accept="video/*" id="icon-button-file-video" type="file" name="video" onChange={handleFileChange} />
                <IconButton color="primary" aria-label="upload video" component="span">
                  <Videocam />
                </IconButton>
              </label>
              <IconButton color="primary" aria-label="record audio" component="span">
                <Mic />
              </IconButton>
            </Box>
            <Button variant="contained" endIcon={<Send />} onClick={handleSubmit}>
              Pubblica
            </Button>
          </Box>
        </Box>
      );
    }
    
    export default AddNote;