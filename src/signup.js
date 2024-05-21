import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Aggiorna il percorso se necessario
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <CenterBox component="main">
      <Typography component="h1" variant="h5">
        Registrati
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSignUp} style={{ marginTop: "20px" }}>
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
        <Box textAlign="center">
          <Link to="/signin" variant="body2">
            {"Sei già registrato? Accedi"}
          </Link>
        </Box>
      </form>
    </CenterBox>
  );
}

export default SignUp;