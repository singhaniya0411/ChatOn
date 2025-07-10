import React, { useState } from "react";
import { resetPass } from "../config/firebase"; // Ensure resetPass is correctly imported

const ForgetPass = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent page refresh
    await resetPass(email); // Call resetPass function
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <form
        onSubmit={onSubmitHandler}
        className="bg-white px-5 py-8 flex flex-col gap-5 border rounded-lg"
      >
        <h2>Reset your password</h2>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Enter your email"
          required
          className="px-2 py-3 border rounded outline-blue-500 border-custom-gray"
        />
        <button
          className="px-3 py-2 bg-blue-500 text-white text-xs border-none rounded cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgetPass;
