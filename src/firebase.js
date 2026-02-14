import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPxBZWq8jVVyHPWOU8nvyHpdY875NDea8",
  authDomain: "babyduvaby-5429b.firebaseapp.com",
  projectId: "babyduvaby-5429b",
  storageBucket: "babyduvaby-5429b.firebasestorage.app",
  messagingSenderId: "485453361226",
  appId: "1:485453361226:web:5db01a529b0514a3e976b3"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
