import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// For demo purposes, using a mock configuration
// In production, you would use your actual Firebase config
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "trading-course-demo.firebaseapp.com",
  projectId: "trading-course-demo",
  storageBucket: "trading-course-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
