import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
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

// Initialize Analytics only on client side and if supported
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
    analytics = analyticsInstance;
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, analytics, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }; 