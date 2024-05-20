import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { Avatar, Button, Typography, Grid } from "@mui/material";
import BottomNavigationBar from "./BottomNavigationBar";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

function Profilo() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Aggiungi qui il valore iniziale dell'username
  const [email, setEmail] = useState(""); // Aggiungi qui il valore iniziale dell'email
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user is signed in, redirect to login page
        navigate("/login");
      } else {
        // User is signed in, you can load the profile data here
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function ...
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      async () => {
        // Complete function ...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setUrl(downloadURL);
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            await updateDoc(userDocRef, {
              profileImageUrl: downloadURL,
            });
          } else {
            await setDoc(userDocRef, {
              profileImageUrl: downloadURL,
            });
          }
        });
      }
    );
  };

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      setUsername(auth.currentUser.displayName);
      setEmail(auth.currentUser.email);
    }
  }, []);

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Avatar
          alt="Foto Profilo"
          src={url || "/path/to/default/profile/picture"}
          sx={{ width: 100, height: 100, marginTop: 5 }}
        />
      </Grid>
      <Grid item>
        <Typography variant="h5">{username}</Typography>
      </Grid>
      <Grid item>
        <Typography sx={{ marginTop: -2, marginBottom: 2 }} variant="body1">
          {email}
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>
      <Grid item>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Carica</button>
      </Grid>

      <Grid
        item
        container
        justifyContent="space-around"
        style={{ width: "100%" }}
      >
        <Typography variant="body1">Post: 10</Typography>{" "}
        {/* Aggiungi qui il numero di post */}
        <Typography variant="body1">Followers: 20</Typography>{" "}
        {/* Aggiungi qui il numero di followers */}
        <Typography variant="body1">Seguiti: 30</Typography>{" "}
        {/* Aggiungi qui il numero di seguiti */}
      </Grid>

      <Grid item>
        <BottomNavigationBar />
      </Grid>
    </Grid>
  );
}

export default Profilo;
