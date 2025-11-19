import React, { useContext, useState } from "react";
import { Context } from "../context.jsx";
import API from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { isAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await API
      .post(
        // "http://localhost:5000/api/auth/password/forgot",
        "/api/auth/password/forgot",
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-900 to-indigo-700 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Forgot Password</h2>
        <p className="mb-6 text-center text-gray-600">Enter your email address to receive a password reset token.</p>
        <form onSubmit={handleForgotPassword} className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
