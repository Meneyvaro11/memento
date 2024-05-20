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
import AddNote from "./AddNote";
import Profilo from "./Profilo";
import { LoadScript } from "@react-google-maps/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <LoadScript googleMapsApiKey="AIzaSyDEkaa4poCV0gbL93m1AzdZohGboPO9rpg">
      <Router>
        <div>
          <Routes>
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
              element={<Home userId={currentUser ? currentUser.uid : null} />}
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
