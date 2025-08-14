// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqFt-R0DU93TyDelEwycEoklpeFy1OTsg",
  authDomain: "election-5c40d.firebaseapp.com",
  projectId: "election-5c40d",
  storageBucket: "election-5c40d.appspot.com",
  messagingSenderId: "769405901825",
  appId: "1:769405901825:web:c4d6ca8e164541e17bb400",
  measurementId: "G-EZTK5X55WW"
};


// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
