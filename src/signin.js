import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from './firebaseConfig'; // Assicurati che il percorso sia corretto
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Importa l'icona di Google

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Errore durante l'accesso con Google:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSignIn} style={{ marginTop: '20px' }}>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
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
            style={{ margin: '20px 0 10px' }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            style={{ margin: '10px 0' }}
          >
            Accedi con Google
          </Button>
          <Box textAlign="center">
            <Link to="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default SignIn;
