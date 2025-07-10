import React, { useContext, useEffect } from "react";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import Chat from "./pages/Chat";
import ProfileUpdate from "./pages/ProfileUpdate";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";
import ForgetPass from "./pages/ForgetPass";

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/chat");

        await loadUserData(user.uid);
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/forgetpassword" element={<ForgetPass />} />
      </Routes>
    </div>
  );
};

export default App;
