import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';

function TopNavbar() {

  const navbarStyle = {
    position: 'fixed', // Imposta la posizione fissa
    top: 0, // Fissa la navbar in alto
    left: 0,
    right: 0,
    zIndex: 1000, // Assicura che la navbar sia sopra gli altri elementi
  };

  return (
    <AppBar position="static" style={navbarStyle}>
      <Toolbar>
        <InputBase
          placeholder="Cerca..."
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton>
          <NotificationsIcon /> {/* Icona delle notifiche di Material-UI */}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavbar;
