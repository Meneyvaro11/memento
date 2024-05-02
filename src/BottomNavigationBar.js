import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddNote from './AddNote'; // Assicurati che il percorso del file sia corretto
import { useNavigate } from 'react-router-dom';


function BottomNavigationBar() {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '60%',
    left: '0%',
    right: '0%',
    width: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderTopLeftRadius: '15px', // Arrotondamento in alto a sinistra
    borderTopRightRadius: '15px', // Arrotondamento in alto a destra
  };

  return (
    <>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          if (newValue === 1) { // Assumendo che "Aggiungi" sia la seconda icona
            handleOpen();
          } else {
            setValue(newValue);
          }
        }}
        showLabels
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        <BottomNavigationAction label="Esplora" icon={<HomeIcon />} onClick={() => navigate('/')} /> 
        <BottomNavigationAction label="Aggiungi" icon={<AddIcon />} />
        <BottomNavigationAction label="Profilo" icon={<ProfileIcon />} onClick={() => navigate('/profilo')} />
      </BottomNavigation>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddNote />
        </Box>
      </Modal>
    </>
  );
}

export default BottomNavigationBar;
