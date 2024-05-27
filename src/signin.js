import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "./firebaseConfig"; // Assicurati che il percorso sia corretto
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { TextField, Button, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Importa l'icona di Google
import { styled } from "@mui/system";

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
});

const CenterBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  padding: "0 20px",
});

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Errore durante l'accesso con Google:", error);
    }
  };

  return (
    <CenterBox
      component="main"
      style={{ backgroundColor: "#40916c", color: "#ffffff" }} // Aggiungi questa riga
    >
      <img
        src="/logo_white.png"
        alt="Logo"
        style={{
          width: "250px",
          height: "auto",
        }}
      />{" "}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSignIn} style={{ marginTop: "20px" }}>
        <StyledTextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Indirizzo Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledTextField
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
          style={{
            margin: "20px 0 10px",
            backgroundColor: "#ffffff",
            color: "#40916c",
          }}
        >
          Accedi
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          style={{ margin: "10px 0", backgroundColor: "#ffffff" }}
        >
          Accedi con Google
        </Button>
        <Box textAlign="center" style={{ marginTop: "50px" }}>
          <Link to="/signup" variant="body2" style={{ color: "#fff" }}>
            {"Non hai un account? Registrati"}
          </Link>
        </Box>
      </form>
    </CenterBox>
  );
}

export default SignIn;
