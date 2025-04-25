import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminDataContext } from "../context/AdminContext";
import ProfileImageUpload from "../context/ProfileImageUpload";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setAdmin(data.admin);
        localStorage.setItem("token", data.token);
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      setEmail("");
      setName("");
      setPassword("");
      setAvatar(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="p-8 w-full max-w-md">
        <div className="bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-bold text-white">Admin Signup</h2>
            </div>
            
            <form onSubmit={submitHandler} className="space-y-4">
              <ProfileImageUpload avatar={avatar} setAvatar={setAvatar} />

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link 
                to="/admin/login" 
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;