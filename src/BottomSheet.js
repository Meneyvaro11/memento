// BottomSheet.js
import React from "react";
import { Drawer, Slide, Box } from "@mui/material";

const BottomSheet = ({ open, onClose, children }) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      transitionDuration={250} // Aumenta la durata dell'animazione a 1000 millisecondi (1 secondo)
      PaperProps={{
        sx: {
          position: "absolute",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          height: "auto",
          maxHeight: "100%",
        },
      }}
    >
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box>{children}</Box>
      </Slide>
    </Drawer>
  );
};

export default BottomSheet;
