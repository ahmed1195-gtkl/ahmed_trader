// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
