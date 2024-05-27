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
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
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
      <form onSubmit={handleSignUp} style={{ marginTop: "20px" }}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Indirizzo Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: "20px 0" }}
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
