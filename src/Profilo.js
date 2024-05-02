import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import BottomNavigationBar from './BottomNavigationBar';

function Profilo() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div>
      {/* Aggiungi qui altri elementi del profilo utente */}
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <BottomNavigationBar />
    </div>
  );
}

export default Profilo;
