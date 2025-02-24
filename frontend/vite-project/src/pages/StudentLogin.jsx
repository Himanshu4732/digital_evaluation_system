import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { StudentDataContext } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { student, setStudent } = useContext(StudentDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const StudentData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `http://localhost:8000/student/login`,
      StudentData
    );

    if (response.status === 200) {
      const data = response.data;
      setStudent(data.student);
      localStorage.setItem("token", data.token);
      navigate("/studentDashboard");
    }

    setEmail("");
    setPassword("");
  };

  return (
   <div className="h-screen w-full flex items-center justify-center bg-zinc-700">
    <div className="p-7 h-auto  flex flex-col justify-center items-center border-0 border-gray-200 rounded-lg bg-zinc-800 text-white">
      <div className="p-7 pt-0 flex flex-col justify-between">
        <h2 className="w-full items-center text-3xl font-bold mb-5">Student Login</h2>

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-zinc-200 mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base placeholder:text-zinc-700 text-black"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>

          <input
            className="bg-zinc-200 mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base
            placeholder:text-zinc-700 text-black"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            type="password"
            placeholder="password"
          />

          <button className="bg-zinc-900 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          New here?{" "}
          <Link to="/student/signup" className="text-blue-600">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/admin/signup"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as Admin
        </Link>
      </div>
    </div>
    </div>
  );
};

export default StudentLogin;
