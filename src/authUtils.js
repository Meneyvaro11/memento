// authUtils.js
import { auth, googleProvider, signInWithPopup } from './firebaseConfig'; // Aggiorna il percorso se necessario

export const handleGoogleSignIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    // Gestisci l'utente dopo il successo dell'accesso
  } catch (error) {
    console.error("Errore durante l'accesso con Google:", error);
  }
};
