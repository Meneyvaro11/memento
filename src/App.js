import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import SignUp from "./signup";
import SignIn from "./signin";
import Home from "./Home";
import Notifications from "./Notifications";
import AddNote from "./AddNote";
import Profilo from "./Profilo";
import { LoadScript } from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utente è loggato
        setCurrentUser(user);
      } else {
        // Utente non è loggato
        setCurrentUser(null);
      }
    });

    // Pulizia dell'observer
    return () => unsubscribe();
  }, []);

  // Recupera lo username quando l'userId cambia
  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        setUsername(userData ? userData.username : null);
      } else {
        setUsername(null);
      }
    };

    fetchUsername();
  }, [currentUser]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDEkaa4poCV0gbL93m1AzdZohGboPO9rpg">
      <Router>
        <div>
          <Routes>
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/signup"
              element={currentUser ? <Navigate to="/" /> : <SignUp />}
            />
            <Route
              path="/signin"
              element={currentUser ? <Navigate to="/" /> : <SignIn />}
            />
            <Route
              path="/"
              element={
                <Home
                  userId={currentUser ? currentUser.uid : null}
                  username={username}
                />
              }
            />
            <Route path="/Profilo" element={<Profilo />} />
            <Route path="/addnote" element={<AddNote />} />
          </Routes>
        </div>
      </Router>
    </LoadScript>
  );
}

export default App;
