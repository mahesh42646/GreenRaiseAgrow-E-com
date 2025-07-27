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

// Initialize Firebase only on client side
let app, auth, db, analytics, googleProvider;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Initialize Analytics only if supported
  isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
    analytics = analyticsInstance;
  });
}

export { auth, db, analytics, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }; 