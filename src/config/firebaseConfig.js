// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBap-Ei5RZBJ6dTmSmaf8D_kqc4HdZDXA",
  authDomain: "chaton-d57d0.firebaseapp.com",
  projectId: "chaton-d57d0",
  storageBucket: "chaton-d57d0.appspot.com",
  messagingSenderId: "747974353316",
  appId: "1:747974353316:web:7f279cc74ed5b0a7672131"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
