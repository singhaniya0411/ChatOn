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
    <div className="h-[65vh] md:h-[75vh] relative bg-chatbox-bg">
      {/* Header */}
      <div className="px-3 py-4 flex items-center gap-3 border-b-[1px] border-custom-gray">
        <img
          className="w-9 aspect-square rounded-full"
          src={chatUser.userData.avatar}
          alt=""
        />
        <p className="flex-1 font-semibold text-xl flex gap-1 items-center text-[#393939]">
          {chatUser.userData.name}

          {Date.now() - chatUser.userData.lastSeen <= 60001 ? (
            <img className="w-4" src={assets.green_dot} />
          ) : (
            ""
          )}
        </p>
        <img className="w-6 rounded-full" src={assets.help_icon} alt="" />
      </div>

      {/* msgs section */}
      <div
        style={{ height: "calc(100% - 70px)" }}
        className="pb-12 overflow-y-scroll flex flex-col-reverse"
      >
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                msg.sId === userData.id
                  ? "flex items-end justify-end gap-1 px-0 py-4"
                  : "flex items-end  gap-1 px-0 py-4 flex-row-reverse justify-end"
              }
            >
              {msg["image"] ? (
                <img className="w-32 rounded-lg" src={msg.image} />
              ) : (
                <p className="text-white bg-blue-500 p-2 max-w-48 text-xs mb-8 rounded-t-lg rounded-b-lg rounded-l-none rounded-r-lg ">
                  {msg.text}
                </p>
              )}
              <div className="flex flex-col items-center">
                <img
                  className="w-6 aspect-square rounded-full"
                  src={
                    msg.sId === userData.id
                      ? userData.avatar
                      : chatUser.userData.avatar
                  }
                  alt=""
                />
                <p className="text-[8px]">{convertTimeStamp(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-2 py-3 bg-white absolute bottom-0 left-0 right-0">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="flex-1 border-none outline-none"
          type="text"
          placeholder="Send a message"
        />
        <input
          onChange={sendImage}
          className="flex-1 border-none outline-none"
          type="file"
          id="image"
          accept="image/png,image/jpeg"
          hidden
        />
        <label className="flex" htmlFor="image">
          <img
            className="w-6 cursor-pointer"
            src={assets.gallery_icon}
            alt=""
          />
        </label>
        <img
          onClick={sendMessage}
          className="w-8 cursor-pointer"
          src={assets.send_button}
          alt=""
        />
      </div>
    </div>
  ) : (
    <div className=" border">
      <div className="w-full bg-gradient-to-r from-sky-200 to-white flex flex-col items-center justify-center gap-1 text-[#adadad] h-[75vh]">
        <img className="w-14" src={assets.logo_icon} alt="" />
        <p className="text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
          Chat anytime ,anywhere
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
