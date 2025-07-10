import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
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
import { logout, resetPass } from "../config/firebase";

const LeftSideBar = () => {
  const [email, setEmail] = useState("");
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
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
  }, []);

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
      if (error.code === "permission-denied") {
        console.error("Permission Denied: ", error.message);
      } else {
        console.error("Error: ", error.message);
      }
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
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 text-white h-[75vh] rounded-tl-lg rounded-bl-lg shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img className="h-8" src={assets.top_logo} alt="Logo" />
            <h1 className="text-xl font-bold text-white">Messages</h1>
          </div>

          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
              <img className="h-5 w-5" src={assets.menu_icon} alt="Menu" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-100"
              >
                Edit Profile
              </button>
              <button
                onClick={() => logout()}
                className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-100"
              >
                Logout
              </button>
              <button
                onClick={() => resetPass(userEmail)}
                className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-100"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img
              className="h-4 w-4 text-blue-300"
              src={assets.search_icon}
              alt="Search"
            />
          </div>
          <input
            onChange={inputHandler}
            className="w-full bg-blue-700 text-white placeholder-blue-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-800 transition-all"
            type="text"
            placeholder="Search contacts..."
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100%-110px)]">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="flex items-center gap-3 p-3 hover:bg-blue-700 cursor-pointer transition-colors border-b border-blue-500"
          >
            <img
              className="w-10 h-10 rounded-full border-2 border-blue-300"
              src={user.avatar}
              alt={user.name}
            />
            <div>
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-xs text-blue-200">Start new chat</p>
            </div>
          </div>
        ) : (
          chatData &&
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-blue-500 ${
                messageId === item.messageId
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full border-2 border-blue-300"
                  src={item.userData.avatar}
                  alt={item.userData.name}
                />
                {Date.now() - item.userData.lastSeen <= 60000 && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-700"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white truncate">
                    {item.userData.name}
                  </p>
                  <span className="text-xs text-blue-200">
                    {new Date(item.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    !item.messageSeen
                      ? "text-white font-semibold"
                      : "text-blue-200"
                  }`}
                >
                  {item.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
