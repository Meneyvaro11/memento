import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// La tua configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBqZ7k8yYCK1_K3hTd46Gu15dLuvbfzDWM",
    authDomain: "memory-lane-eec2d.firebaseapp.com",
    projectId: "memory-lane-eec2d",
    storageBucket: "memory-lane-eec2d.appspot.com",
    messagingSenderId: "1039533606693",
    appId: "1:1039533606693:web:78f31a96d7733032713ccc",
    measurementId: "G-D6N2KR3BTP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, signInWithPopup, db, storage };


