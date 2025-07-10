import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import upload from "../lib/upload";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { userData, messageId, chatUser, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];

        userIds.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapShot = await getDoc(userChatRef);

          if (userChatSnapShot.exists()) {
            const userChatData = userChatSnapShot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];

        userIds.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapShot = await getDoc(userChatRef);

          if (userChatSnapShot.exists()) {
            const userChatData = userChatSnapShot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hours = date.getHours();
    const minute = date.getMinutes();

    if (hours > 12) {
      return hours - 12 + ":" + minute + "PM";
    } else {
      return hours + ":" + minute + "AM";
    }
  };

  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messageId]);

  return chatUser ? (
    <div className="h-[75vh] relative bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
        <img
          className="w-10 aspect-square rounded-full border-2 border-white"
          src={chatUser.userData.avatar}
          alt=""
        />
        <p className="flex-1 font-semibold text-lg flex gap-2 items-center text-white">
          {chatUser.userData.name}

          {Date.now() - chatUser.userData.lastSeen <= 60001 ? (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          ) : (
            ""
          )}
        </p>
        <button className="p-1 rounded-full hover:bg-blue-700 transition-colors">
          <img className="w-5" src={assets.help_icon} alt="Help" />
        </button>
      </div>

      {/* msgs section */}
      <div
        style={{ height: "calc(100% - 70px)" }}
        className="pb-12 overflow-y-scroll flex flex-col-reverse bg-gradient-to-b from-blue-50 to-blue-100"
      >
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                msg.sId === userData.id
                  ? "flex items-end justify-end gap-2 px-4 py-2"
                  : "flex items-end gap-2 px-4 py-2"
              }
            >
              {msg["image"] ? (
                <div
                  className={
                    msg.sId === userData.id
                      ? "bg-blue-500 p-1 rounded-lg shadow-md"
                      : "bg-blue-100 p-1 rounded-lg shadow-md"
                  }
                >
                  <img className="w-48 rounded-lg" src={msg.image} />
                </div>
              ) : (
                <div
                  className={
                    msg.sId === userData.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 max-w-xs rounded-2xl rounded-br-none shadow-md"
                      : "bg-white text-blue-900 p-3 max-w-xs rounded-2xl rounded-bl-none shadow-md"
                  }
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              )}
              <div className="flex flex-col items-center space-y-1">
                <img
                  className="w-8 aspect-square rounded-full border-2 border-white shadow"
                  src={
                    msg.sId === userData.id
                      ? userData.avatar
                      : chatUser.userData.avatar
                  }
                  alt=""
                />
                <p className="text-xs text-blue-600 font-medium">
                  {convertTimeStamp(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white absolute bottom-0 left-0 right-0 border-t border-blue-200 shadow-inner">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="flex-1 border border-blue-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          type="text"
          placeholder="Type a message..."
        />
        <input
          onChange={sendImage}
          className="hidden"
          type="file"
          id="image"
          accept="image/png,image/jpeg"
        />
        <label className="flex p-2 rounded-full hover:bg-blue-100 transition-colors cursor-pointer">
          <img className="w-6" src={assets.gallery_icon} alt="Attach image" />
        </label>
        <button
          onClick={sendMessage}
          className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md"
        >
          <img className="w-6" src={assets.send_button} alt="Send message" />
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center gap-3">
      <div className="p-4 bg-white rounded-full shadow-lg">
        <img className="w-16" src={assets.logo_icon} alt="Logo" />
      </div>
      <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
        Chat anytime, anywhere
      </p>
      <p className="text-blue-500 text-sm">Select a chat to start messaging</p>
    </div>
  );
};

export default ChatBox;
