// lib/firebase.js
// THIS IS THE CORRECT FORMAT

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// Note: You do not need getAnalytics unless you plan to use it.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSNQ1nmmDY0wa-H0RJ0RwkeslGJQkZj7o",
  authDomain: "empusaai-9b006.firebaseapp.com",
  projectId: "empusaai-9b006",
  storageBucket: "empusaai-9b006.appspot.com", // Corrected property name from firebasestorage.app
  messagingSenderId: "682300819938",
  appId: "1:682300819938:web:09ad52dbf4e33b311991bb",
  measurementId: "G-BD9XJT26ZN"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
