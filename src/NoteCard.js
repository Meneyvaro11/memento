// React
import { useState, useEffect } from "react";

// Firebase
import {
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, auth } from "./firebaseConfig";

// Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const NoteCard = ({ note, onDelete, userId }) => {
  const [likes, setLikes] = useState(note.likes ? note.likes.length : 0);
  const [liked, setLiked] = useState(
    note.likes && note.likes.some((like) => like.userId === userId)
  );
  const currentUser = auth.currentUser;
  const username = currentUser.displayName; // Assumendo che l'username sia salvato come displayName

  useEffect(() => {
    const noteRef = doc(db, "notes", note.id);
    const unsubscribe = onSnapshot(noteRef, (doc) => {
      const data = doc.data();
      setLikes(data && data.likes ? data.likes.length : 0);
    });

    // Pulizia alla dismontaggio
    return () => unsubscribe();
  }, [note.id]);

  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUrl(docSnap.data().profileImageUrl);
        }
      }
    };
  }, []);

  const deleteComment = async (index) => {
    const newComments = [...note.comments];
    newComments.splice(index, 1);

    await updateDoc(doc(db, "notes", note.id), {
      comments: newComments,
    });
  };

  const handleLike = async () => {
    const noteRef = doc(db, "notes", note.id);

    // Assicurati che userId sia definito
    if (!userId) {
      console.error("userId is undefined");
      return;
    }

    // Ottieni i dati correnti della nota
    const noteSnapshot = await getDoc(noteRef);
    const noteData = noteSnapshot.data();

    // Crea un nuovo oggetto like
    const newLike = { userId: userId };

    // Aggiungi o rimuovi il like dall'array di likes, a seconda dello stato corrente
    let newLikes;
    if (
      noteData.likes &&
      noteData.likes.some((like) => like.userId === userId)
    ) {
      newLikes = noteData.likes.filter((like) => like.userId !== userId);
    } else {
      newLikes = noteData.likes ? [...noteData.likes, newLike] : [newLike];
    }

    // Aggiorna il documento con i nuovi likes
    await updateDoc(noteRef, { likes: newLikes });

    // Aggiorna lo stato 'liked'
    setLiked(newLikes.some((like) => like.userId === userId));

    // Aggiorna il conteggio dei likes
    setLikes(newLikes.length);
  };

  const handleDelete = async (id) => {
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
    if (onDelete) {
      onDelete();
    }
  };

  // Aggiungi un nuovo stato per il commento corrente e la visibilità del dialog
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  // Aggiungi una funzione per gestire l'apertura e la chiusura del dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentSubmit = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const username = auth.currentUser?.displayName;

    if (!username || !userId) {
      console.error("Username or userId is undefined");
      return;
    }

    const noteRef = doc(db, "notes", note.id);

    const newComment = {
      userId: userId,
      username: username,
      text: comment,
      profileImageUrl: url,
    }; // Modifica qui

    const newComments = note.comments
      ? [...note.comments, newComment]
      : [newComment];

    await updateDoc(noteRef, { comments: newComments });

    setComment("");
    handleClose();
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        padding: "0rem 0",
        margin: "1rem 1rem",
        borderRadius: "10px",
      }}
    >
      <CardContent>
        <Box style={{ display: "flex", alignItems: "flex-start" }}>
          <Avatar
            src={note.profileImageUrl}
            alt={note.userName}
            sx={{ width: 40, height: 40, mr: 2, mt: 0.5 }}
          />
          <Box>
            <Typography variant="subtitle1">{note.userName}</Typography>

            <Typography variant="body2" color="text.secondary">
              {note.text}
            </Typography>
            {note.image && (
              <img
                src={note.image}
                alt="Note"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  marginTop: "1rem",
                }}
              />
            )}
            <CardActions
              disableSpacing
              style={{ marginLeft: 0, paddingLeft: 0 }}
            >
              <Tooltip title="Mi piace">
                <IconButton
                  aria-label="add to favorites"
                  style={{ marginLeft: 0, paddingLeft: 0 }}
                  onClick={handleLike}
                >
                  <FavoriteIcon color={liked ? "error" : "action"} />
                </IconButton>
              </Tooltip>
              <Typography variant="body2">{likes}</Typography>

              <Tooltip title="Commenta">
                <div>
                  <IconButton onClick={handleClickOpen}>
                    <CommentIcon />
                  </IconButton>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        height: "100vh",
                        width: "100vw",
                      },
                    }}
                  >
                    <Box display="flex" flexDirection="column" height="100vh">
                      <DialogTitle>Commenti</DialogTitle>
                      <DialogContent>
                        <List>
                          {note.comments &&
                            note.comments.map((comment, index) => (
                              <ListItem key={index}>
                                <ListItemAvatar>
                                  <Avatar src={comment.profileImageUrl} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={comment.text}
                                  secondary={`${comment.username}`}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </DialogContent>
                      <Box display="flex" justifyContent="center">
                        <TextField
                          autoFocus
                          margin="dense"
                          id="comment"
                          label="Aggiungi un commento"
                          type="text"
                          fullWidth
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          style={{ width: "80%" }}
                        />
                      </Box>
                    </Box>

                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Annulla
                      </Button>
                      <Button onClick={handleCommentSubmit} color="primary">
                        Invia
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </Tooltip>
              <Typography variant="body2">
                {note.comments ? note.comments.length : 0}
              </Typography>
              <Tooltip title="Condividi">
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2">0{note.shares}</Typography>
              {username === note.userName && (
                <Tooltip title="Elimina">
                  <IconButton
                    style={{ color: "red" }}
                    aria-label="delete"
                    onClick={() => handleDelete(note.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </CardActions>
            <Typography variant="body2">
              {note.timestamp
                ? note.timestamp
                    .toDate()
                    .toLocaleString("it-IT", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                : ""}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
