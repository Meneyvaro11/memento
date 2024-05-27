import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { Avatar, Button, Typography, Grid } from "@mui/material";
import BottomNavigationBar from "./BottomNavigationBar";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

function Profilo({ userId }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Aggiungi qui il valore iniziale dell'username
  const [email, setEmail] = useState(""); // Aggiungi qui il valore iniziale dell'email
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [userNotes, setUserNotes] = useState([]);

  useEffect(() => {
    const fetchUserNotes = async () => {
      if (userId) {
        const q = query(collection(db, "notes"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserNotes(notesData);
      }
    };

    fetchUserNotes();
  }, [userId]);

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
        <Typography variant="body1">Post: {userNotes.length}</Typography>
        <Typography variant="body1">Followers: </Typography>
        <Typography variant="body1">Seguiti: </Typography>
      </Grid>
      <div className="container">
        <div className="grid-container">
          {userNotes.map((note) => (
            <div className="card" key={note.id}>
              <div className="card-content">
                <h3 className="text">{note.text.substring(0, 6)}..</h3>
                <p className="date">
                  {" "}
                  {note.timestamp
                    ? note.timestamp.toDate().toLocaleString("it-IT", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Grid item>
        <BottomNavigationBar />
      </Grid>
    </Grid>
  );
}

export default Profilo;
