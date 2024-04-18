
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArkaA3pWmUUgbfnVSlgLOk0TDCt5SsxMM",
  authDomain: "react-notes-352f8.firebaseapp.com",
  projectId: "react-notes-352f8",
  storageBucket: "react-notes-352f8.appspot.com",
  messagingSenderId: "1065485949852",
  appId: "1:1065485949852:web:c79f90a2080a6bce92c659"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const notesCollection = collection(db, "notes")