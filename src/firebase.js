import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvaN0_iUrGlwsLq7cdfUEp1-ULtyjMEcU",
  authDomain: "green-raise-agro.firebaseapp.com",
  projectId: "green-raise-agro",
  storageBucket: "green-raise-agro.firebasestorage.app",
  messagingSenderId: "808162429235",
  appId: "1:808162429235:web:0eaac96646bc5e494c9646",
  measurementId: "G-CMR5FXCRE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }; 