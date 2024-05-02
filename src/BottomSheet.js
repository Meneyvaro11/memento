// BottomSheet.js
import React from 'react';
import Slide from '@mui/material/Slide';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

const BottomSheet = ({ open, onClose, children }) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      transitionDuration={250}
      PaperProps={{
        sx: {
          position: 'absolute',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          height: 'auto',
          maxHeight: '50%',
        },
      }}
    >
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box>
          {children}
        </Box>
      </Slide>
    </Drawer>
  );
};

export default BottomSheet;
