import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminDataContext } from "../context/AdminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { admin, setAdmin } = useContext(AdminDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setAdmin(data.admin);
        localStorage.setItem("token", data.token);
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
      <div className="p-7 h-3-4 flex flex-col justify-between bg-zinc-700 border-2 border-gray-800 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-5">Admin Login</h2>
          <form onSubmit={submitHandler}>
            <h3 className="text-md font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-1 border w-full text-md placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-md font-medium mb-2">Enter Password</h3>
            <input
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-1 border w-full text-md placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
            />

            <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-1 w-full text-md placeholder:text-base">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;