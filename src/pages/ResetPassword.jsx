import React, { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../context.jsx";
import API from "../services/api.js";

const ResetPassword = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }
    await API
      .put(
        // `http://localhost:5000/api/auth/password/reset/${token}`,
        `/api/auth/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-900 to-indigo-700 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Reset Password</h2>
        <p className="mb-6 text-center text-gray-600">Enter your new password below.</p>
        <form className="flex flex-col" onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
