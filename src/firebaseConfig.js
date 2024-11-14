// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALvZNmvhhD_c6mk6zJOYxLQN01eLmpJis",
  authDomain: "mykure-lite.firebaseapp.com",
  projectId: "mykure-lite",
  storageBucket: "mykure-lite.firebasestorage.app",
  messagingSenderId: "249830297725",
  appId: "1:249830297725:web:30ef523f58b4d2c5cfe114",
  measurementId: "G-07FN8FWWGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
