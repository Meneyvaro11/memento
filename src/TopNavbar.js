import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { styled } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  position: "fixed",
  top: 10,
  left: 0,
  right: 0,
  zIndex: 1000,
  width: "95%",
  backgroundColor: "#40916c",
  padding: "10px",
  margin: "auto",
  borderRadius: 50,
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 30, // Rimuove il bordo arrotondato
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px", // Aggiunge un po' di margine interno
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white", // Cambia il colore del bordo in bianco
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white", // Cambia il colore del bordo in bianco quando è in focus
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
    color: "black", // Cambia il colore del testo in nero quando è in focus
  },
  backgroundColor: "white", // Cambia il colore di sfondo in bianco
  borderRadius: 30, // Rimuove il bordo arrotondato
  width: "100%", // Rende la barra di ricerca più lunga
  margin: 0, // Rimuove i margini
  marginLeft: -10,
});

function TopNavbar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (event, newValue) => {
    setSearch(newValue);
    // Qui potresti fare una chiamata API per ottenere i suggerimenti di ricerca
    // basati sul nuovo valore di ricerca e impostare i suggerimenti con il risultato.
    // Per ora, impostiamo solo i suggerimenti con un array vuoto.
    setSuggestions([]);
  };

  return (
    <StyledAppBar>
      <Toolbar>
        <Box flexGrow={1}>
          <Autocomplete
            value={search}
            onChange={handleSearchChange}
            options={suggestions}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Cerca..."
                variant="outlined"
              />
            )}
          />
        </Box>
        <Link to="/notifications">
          <IconButton style={{ marginLeft: "0rem", color: "white" }}>
            <NotificationsIcon />
          </IconButton>
        </Link>
      </Toolbar>
    </StyledAppBar>
  );
}

export default TopNavbar;
