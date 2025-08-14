// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCchtYHuVagUwlNRY3lsVI1avGPNAef_cM",
  authDomain: "voting-app-b7606.firebaseapp.com",
  projectId: "voting-app-b7606",
  storageBucket: "voting-app-b7606.appspot.com",
  messagingSenderId: "435612787360",
  appId: "1:435612787360:web:73f3ceec651edad573dfc5",
  measurementId: "G-EDKCMWPYJ6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;


export { app, db, auth, analytics };
