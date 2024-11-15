import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";
import { AppContext } from "../context/AppContext";

const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let temp = [];
    messages.map((msg) => {
      if (msg.image) {
        temp.push(msg.image);
      }
    });
    // console.log(temp);
    setMsgImages(temp);
  }, [messages]);

  return chatUser ? (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll">
      <div className="pt-14 text-center items-center flex flex-col ">
        <img
          className="w-[110px] aspect-square rounded-full"
          src={chatUser.userData.avatar}
          alt=""
        />
        <h3 className="text-[15px] flex font-normal items-center justify-center gap-1 mx-1 my-0">
          {chatUser.userData.name}
        </h3>
        <h4 className="text-[8px]">
          {Date.now() - chatUser.userData.lastSeen <= 60001 ? "Online" : ""}
        </h4>
        <p className=" max-w-[70%] text-xs opacity-80 font-light">
          {chatUser.userData.bio}
        </p>
      </div>
      <hr className="border-[#ffffff50] mx-4 my-0" />
      <div className="px-1 py-5 text-xs ">
        <p>Media</p>
        <div className="max-h-[180px] overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-1 mt-2">
          {msgImages.map((url, index) => (
            <img
              className="rounded"
              onClick={() => window.open(url)}
              key={index}
              src={url}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center text-[12px]">
        <button
          onClick={() => logout()}
          className=" bottom-10 bg-blue-500 py-3 px-10 rounded-full"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll ">
      <div className="flex items-center justify-center text-[12px]">
        <button
          className="absolute bottom-5 bg-blue-500 py-3 px-10 rounded-full"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSideBar;
