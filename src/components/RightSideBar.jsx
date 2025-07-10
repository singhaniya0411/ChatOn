import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";
import { AppContext } from "../context/AppContext";

const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    const images = messages.filter((msg) => msg.image).map((msg) => msg.image);
    setMsgImages(images);
  }, [messages]);

  return chatUser ? (
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 text-white h-[75vh] rounded-tr-lg rounded-br-lg shadow-xl overflow-hidden flex flex-col">
      {/* Profile Section */}
      <div className="pt-8 pb-4 px-4 text-center flex flex-col items-center border-b border-blue-500">
        <div className="relative mb-3">
          <img
            className="w-24 h-24 rounded-full border-4 border-blue-300 shadow-md"
            src={chatUser.userData.avatar}
            alt={chatUser.userData.name}
          />
          {Date.now() - chatUser.userData.lastSeen <= 60001 && (
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-600"></div>
          )}
        </div>

        <h3 className="text-lg font-semibold flex items-center gap-1">
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 60001 && (
            <span className="text-xs text-blue-200">• Online</span>
          )}
        </h3>

        {chatUser.userData.bio && (
          <p className="mt-2 text-sm text-blue-100 max-w-[80%]">
            {chatUser.userData.bio}
          </p>
        )}
      </div>

      {/* Media Section */}
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-center mb-3">Shared Media</h4>
        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {msgImages.map((url, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(url)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={url}
                  alt={`Shared media ${index + 1}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-blue-200 py-4">
            No media shared yet
          </p>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={logout}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full transition-colors shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 text-white h-[75vh] rounded-tr-lg rounded-br-lg shadow-xl flex flex-col justify-center items-center">
      <div className="text-center p-6">
        <p className="text-blue-200 mb-4">Select a chat to view details</p>
        <button
          onClick={logout}
          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-full transition-colors shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSideBar;
