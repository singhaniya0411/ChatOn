// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "./firebaseConfig";


const firebaseConfig = {
  apiKey: "AIzaSyBBap-Ei5RZBJ6dTmSmaf8D_kqc4HdZDXA",
  authDomain: "chaton-d57d0.firebaseapp.com",
  projectId: "chaton-d57d0",
  storageBucket: "chaton-d57d0.appspot.com",
  messagingSenderId: "747974353316",
  appId: "1:747974353316:web:7f279cc74ed5b0a7672131"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// const auth = getAuth(app)

// const db = getFirestore(app)

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const user = res.user;
    console.log(res.user)

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: '',
      bio: 'Hey ',
      lastSeen: Date.now()
    })

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    })

    toast.success("Account created successfully!")
  } catch (error) {
    console.error(error.message);
    toast.error(error.code.split('/')[1].split('-').join(''))

  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!")
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
}

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!")

  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Reset email sent. Check your inbox!");
  } catch (error) {
    // Handle specific errors
    if (error.code === "auth/user-not-found") {
      toast.error("No account found with this email.");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid email format.");
    } else {
      toast.error("Failed to send reset email. Try again later.");
    }
    console.error(error);
  }
};

export { signup, login, logout, resetPass, auth, db }