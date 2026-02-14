import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCI1PUFySA0eOJ7P3-yrqu6eCseq9Lsxrk",
  authDomain: "babyduvaby-7b3d8.firebaseapp.com",
  projectId: "babyduvaby-7b3d8",
  storageBucket: "babyduvaby-7b3d8.firebasestorage.app",
  messagingSenderId: "200650639061",
  appId: "1:200650639061:web:b1a2ec28b66a8e3190445c"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
