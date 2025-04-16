import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/Logos/Calibrage_Logo.png";
export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-[#FFDAB9]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <img src={Logo} alt="HRMS Logo" className="mx-auto mb-6 h-16" />
        <h1 className="text-xl font-semibold text-gray-700 mb-6">HRMS</h1>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition duration-300"
          >
            Sign In
          </button>
          <a
            href="/forgot-password"
            className="text-orange-500 text-sm hover:underline"
          >
            Forgot Password?
          </a>
          <a
            href="/signup"
            className="text-orange-500 text-sm hover:underline block mt-2"
          >
          <span>Don't have an account? </span> Sign Up
          </a>
          <p className="text-xs text-gray-500 mt-6">
            HRMS Copyright © 2025 Calibrage Info Systems Pvt. Ltd.
          </p>
        </div>
      </div>
    </div>
  );
};
