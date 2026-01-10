// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdqIi8pFctBGGT5z5wkBJ_ZzBAcf72BVI",
  authDomain: "ahmed-trader.firebaseapp.com",
  projectId: "ahmed-trader",
  storageBucket: "ahmed-trader.firebasestorage.app",
  messagingSenderId: "840597313148",
  appId: "1:840597313148:web:2cca5b22ff097937fb9bf9",
  measurementId: "G-HKBBRXN3PR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, storage, googleProvider };
