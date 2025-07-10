import React, { useState } from "react";
import assets from "../assets/assets";
import { signup, login, resetPass } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign Up") {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };
  
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-10 md:gap-0"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <img className="w-[max(20vw,200px)] " src={assets.logo_big} alt="" />
      <form
        onSubmit={onSubmitHandler}
        className="bg-white px-5 py-8 flex flex-col gap-5 border rounded-lg"
      >
        <h2 className="font-semibold text-2xl">{currState}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="Username"
            required
            className="px-2 py-3 border rounded outline-blue-500 border-custom-gray"
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Enter your Email"
          required
          className="px-2 py-3 border rounded outline-blue-500 border-custom-gray"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Enter your password"
          className="px-2 py-3 border rounded outline-blue-500 border-custom-gray"
        />
        <button
          className="px-3 py-2 bg-blue-500 text-white text-xs border-none rounded cursor-pointer"
          type="submit"
        >
          {currState === "Sign Up" ? "Create account " : "Sign In"}
        </button>

        <div className="flex gap-1 text-xs text-color-gray ">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-1 ">
          {currState === "Sign Up" ? (
            <p className="text-xs text-color-gray">
              Already have an account ?
              <span
                onClick={() => setCurrState("Log In")}
                className="font-semibold cursor-pointer text-blue-500"
              >
                Click here
              </span>
            </p>
          ) : (
            <p className="text-xs text-color-gray">
              Create an account
              <span
                onClick={() => setCurrState("Sign Up")}
                className="font-semibold cursor-pointer text-blue-500 p-2"
              >
                Click here
              </span>
            </p>
          )}
          {currState === "Log In" ? (
            <p className="text-xs text-color-gray">
              Forgot password ?
              <span
                onClick={() => navigate("/forgetpassword")}
                className="font-semibold cursor-pointer text-blue-500 p-2"
              >
                Reset here .
              </span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
