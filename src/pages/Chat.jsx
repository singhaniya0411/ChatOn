import React, { useContext, useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatBox from "../components/ChatBox";
import RightSideBar from "../components/RightSideBar";
import { AppContext } from "../context/AppContext";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chatData, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 p-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-white">
            Loading your chats...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex h-[75vh] flex-col md:grid md:grid-cols-[0.9fr_2fr_1fr] relative">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex justify-between items-center p-3 bg-blue-600 text-white md:hidden">
              <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className="p-2 rounded-lg hover:bg-blue-700"
              >
                {showLeftSidebar ? <IoClose size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold">Messages</h1>
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className="p-2 rounded-lg hover:bg-blue-700"
              >
                {showRightSidebar ? (
                  <IoClose size={24} />
                ) : (
                  <span>Profile</span>
                )}
              </button>
            </div>
          )}

          {/* Left Sidebar - Hidden on mobile unless toggled */}
          <div
            className={`${
              isMobile
                ? `absolute inset-y-0 left-0 z-20 w-64 bg-white transform ${
                    showLeftSidebar ? "translate-x-0" : "-translate-x-full"
                  } transition-transform duration-300 ease-in-out shadow-xl`
                : "block"
            } border-r border-blue-100`}
          >
            <LeftSideBar />
          </div>

          {/* Chat Box  */}
          <div className="flex-1 h-full overflow-hidden">
            <ChatBox />
          </div>

          {/* Right Sidebar - Hidden on mobile unless toggled */}
          <div
            className={`${
              isMobile
                ? `absolute inset-y-0 right-0 z-20 w-64 bg-white transform ${
                    showRightSidebar ? "translate-x-0" : "translate-x-full"
                  } transition-transform duration-300 ease-in-out shadow-xl`
                : "block"
            } border-l border-blue-100`}
          >
            <RightSideBar />
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {(showLeftSidebar || showRightSidebar) && isMobile && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
