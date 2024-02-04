"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleIsFocused = () => {
    setIsFocused(true);
  };

  const checkIfValidEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const register = () => {
    axios
      .post("http://localhost:8002/api/register", {
        email,
        username,
        password,
      })
      .then((res) => {
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="bg-[#F8F8F8] flex items-center justify-center h-screen">
      <div className=" form p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          className="element w-full border p-2 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="element w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={register} className="w-full border p-2 rounded mb-4">
          Register
        </button>
      </div>
    </div>
  );
};
export default RegisterForm;
