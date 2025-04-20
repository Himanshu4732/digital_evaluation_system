import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TeacherDataContext } from "../context/TeacherContext";
import axios from "axios";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setTeacher } = useContext(TeacherDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/teacher/login`,
        { email, password }
      );

      if (response.status === 200) {
        const data = response.data;
        setTeacher({
          email: data.teacher.email,
          name: data.teacher.name,
        });
        localStorage.setItem("token", data.token);
        navigate("/teacherDashboard");
      }
    } catch (error) {
      console.error("Error during teacher login:", error);
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="p-8 w-full max-w-md">
        <div className="bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-zinc-700 transition-all duration-300">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-bold text-white">Teacher Login</h2>
            </div>
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="email"
                  placeholder="teacher@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              New here?{" "}
              <Link 
                to="/teacher/signup" 
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Create new Account
              </Link>
            </div>

            <div className="mt-4">
              <Link
                to="/student/login"
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;