// NoteCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const NoteCard = ({ note }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {note.userName}
        </Typography>
        <Typography variant="body2">
          {note.text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
