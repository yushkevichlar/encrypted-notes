import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const config = {
  apiKey: "AIzaSyDinfvKoWp93AfmCmCPa4V4d_4KOFLAypw",
  authDomain: "react-encrypted-notes-999e7.firebaseapp.com",
  projectId: "react-encrypted-notes-999e7",
  storageBucket: "react-encrypted-notes-999e7.appspot.com",
  messagingSenderId: "142411370159",
  appId: "1:142411370159:web:45f63c45d83c71af580e5a",
};

const app = firebase.initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = firebase.database();

export { auth, provider, db };
