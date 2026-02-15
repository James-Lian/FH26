import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaW6hpZOLv_1LDqrYxdJm5b9iwbdFsT3E",
  authDomain: "fh26-2dd1a.firebaseapp.com",
  projectId: "fh26-2dd1a",
  storageBucket: "fh26-2dd1a.firebasestorage.app",
  messagingSenderId: "987679172585",
  appId: "1:987679172585:web:d05d07d984062615988d78",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
