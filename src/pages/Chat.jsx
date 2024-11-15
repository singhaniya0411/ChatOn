import React, { useContext, useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBox";
import RightSideBar from "../components/RightSideBar";
import { AppContext } from "../context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);
  return (
    <div
      className="min-h-screen grid place-items-center"
      style={{ background: "linear-gradient(#596Aff, #383699)" }}
    >
      {loading ? (
        <p className="text-2xl text-white">Loading...</p>
      ) : (
        <div className="w-[95%] h-[75vh] max-w-5xl bg-blue-100 grid grid-cols-[1fr_2fr_1fr] chat-container ">
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

export default Chat;
