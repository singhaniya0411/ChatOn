import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../lib/upload";
import { AppContext } from "../context/AppContext";

const ProfileUpdate = () => {
  const [image, setImagae] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile Picture");
      }
      const docRef = doc(db, "users", uid);

      if (image) {
        const imageUrl = await upload(image);
        setPrevImage(imageUrl);
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile Updated!");
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover flex justify-center items-center "
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <div className="bg-white flex justify-end border-black min-w-[700px] rounded-xl ">
        <form onSubmit={profileUpdate} className="flex flex-col gap-5 p-10">
          <h2 className="text-xl font-medium">Profile Details</h2>
          <label
            className="flex items-center gap-2 text-gray-600"
            htmlFor="avatar"
          >
            <input
              onChange={(e) => setImagae(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              className="w-12 aspect-square rounded-full"
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="p-2 min-w-[300px] outline-blue-500 border-custom-gray border rounded-lg"
            type="text"
            placeholder="Your Name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 min-w-[300px] outline-blue-500 border-custom-gray border rounded-lg"
            placeholder="Bio"
            required
          ></textarea>
          <button
            className="border-none bg-blue-500 text-white text-[15px] p-2 cursor-pointer rounded-lg"
            type="submit"
          >
            Save
          </button>
        </form>
        <div className="flex items-end justify-end border-black ">
          <img
            className="max-w-[160px] aspect-square mx-5
            my-auto rounded-full"
            src={
              image
                ? URL.createObjectURL(image)
                : prevImage
                ? prevImage
                : assets.logo_icon
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
