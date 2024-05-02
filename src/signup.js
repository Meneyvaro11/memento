import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseConfig'; // Aggiorna il percorso se necessario
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSignUp} style={{ marginTop: '20px' }}>
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
            style={{ margin: '20px 0' }}
          >
            Register
          </Button>
          <Box textAlign="center">
            <Link to="/signin" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default SignUp;
