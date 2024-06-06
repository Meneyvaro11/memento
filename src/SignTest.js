import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Aggiorna il percorso se necessario
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { styled } from "@mui/system";

import { TextField, Button, Typography, Box } from "@mui/material";

const CenterBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  padding: "0 20px",
});

function SignUp() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Aggiungi l'username all'utente in Firebase Authentication
      await updateProfile(user, {
        displayName: username,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);

    // Regex per la validazione dell'email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError("Per favore inserisci un indirizzo email valido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);

    if (password !== confirmPassword) {
      setPasswordError("Le password non coincidono.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <CenterBox component="main">
      <img
        src="/logo.png"
        alt="Logo"
        style={{
          width: "250px",
          height: "auto",
        }}
      />{" "}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSignUp} style={{ marginTop: "10px" }}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}
        <TextField
          margin="normal"
          required
          fullWidth
          label="Indirizzo Email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <TextField
          label="Conferma Password"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: "20px 0" }}
          onClick={(e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
              alert("Le password non coincidono");
            } else {
              // Il tuo codice per gestire la registrazione...
            }
          }}
        >
          Registrati
        </Button>
        <Box textAlign="center" style={{ marginTop: "50px" }}>
          <Link to="/signin" variant="body2" style={{ color: "#40916c" }}>
            {"Sei già registrato? Accedi"}
          </Link>
        </Box>
      </form>
    </CenterBox>
  );
}

export default SignUp;
