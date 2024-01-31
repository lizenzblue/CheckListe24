"use client";
import axios from "axios";
import React, { useState } from "react";

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const login = () => {
    axios
      .post("http://localhost:8002/api/login_check", {
        username,
        password,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="bg-[#F8F8F8] flex items-center justify-center h-screen">
      <div className=" form p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="element w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login} className="w-full border p-2 rounded mb-4">
          Login
        </button>
      </div>
    </div>
  );
};
export default LoginForm;
