import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { db, logout } from "../config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessageId,
    messageId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;

      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          where("username", ">=", input),
          where("username", "<", input.toLowerCase() + "\uf8ff")
        );
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });

          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addChat = async () => {
    const msgsRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMsgsRef = doc(msgsRef);
      await setDoc(newMsgsRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMsgsRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMsgsRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChat({
        messageId: newMsgsRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const setChat = async (item) => {
    try {
      setMessageId(item.messageId);
      setChatUser(item);
      const userChatRef = doc(db, "chats", userData.id);
      const userChatSnapshot = await getDoc(userChatRef);
      const userChatData = userChatSnapshot.data();
      console.log(userChatData);
      const chatIndex = userChatData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatRef, {
        chatsData: userChatData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev) => ({ ...prev, userData: userData }));
      }
    };
    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`bg-chat-bg h-[75vh]`}>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <img className="max-w-32" src={assets.logo} alt="" />
          <div className="opacity-100 cursor-pointer relative px-3 py-0 group">
            <img className="max-h-5" src={assets.menu_icon} alt="" />
            <div className="text-black text-[14px] hidden group-hover:block absolute top-full left-0 mt-1 bg-white p-2 rounded">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 flex items-center gap-2 px-2 py-3 mt-5 rounded">
          <img className="w-4" src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            className="placeholder-custom-placeholder bg-transparent border-none outline-none text-white text-xs"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex flex-col h-full max-h-[75%] overflow-y-auto">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="group hover:bg-blue-500 text-white flex gap-3 items-center cursor-pointer font-xs px-3 py-5"
          >
            <img
              className="w-9 aspect-square rounded-full"
              src={user.avatar}
              alt=""
            />
            <p className="text-xs">{user.name}</p>
          </div>
        ) : (
          chatData &&
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`group hover:bg-blue-500 text-white flex gap-3 items-center cursor-pointer font-xs px-3 py-5`}
            >
              <img
                className="w-9 aspect-square rounded-full"
                src={item.userData.avatar}
                alt=""
              />
              <div className="flex flex-col">
                <p className="text-xs">{item.userData.name}</p>
                <span
                  className={`group-hover:text-white text-xs ${
                    !item.lastSeen ? "text-[#07fff3]" : "text-[#9f9f9f]"
                  }`}
                >
                  {item.lastMessage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
