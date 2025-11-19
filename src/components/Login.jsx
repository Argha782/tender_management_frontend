import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Context } from "../context.jsx";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api.js";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const [showPasswords, setShowPasswords] = useState({
    pw: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = async (data) => {
  try {
    const res = await API.post("/api/auth/login", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    toast.success(res.data.message);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setIsAuthenticated(true);
    setUser(res.data.user);

    const role = res.data.user.role;
    if (role === "vendor") navigateTo("/");
    else if (role === "tenderowner" || role === "superadmin") navigateTo("/dashboard");
    else navigateTo("/");

  } catch (error) {
    let message = "Login failed";

    if (error.response.data.message) {
      message = error.response.data.message;
    } 
    else if (error.message) {
      message = error.message; // fallback to native error
    }

    toast.error(message);
    console.error("Login Error:", error); // helpful in dev mode
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-700 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit((data) => handleLogin(data))}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          required
          {...register("email")}
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="relative">
          <input
            type={showPasswords.pw ? "text" : "password"}
            placeholder="Password"
            required
            {...register("password")}
            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                pw: !prev.pw,
              }))
            }
            className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
          >
            {showPasswords.pw ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <p className="text-right mb-4">
          <Link
            to={"/password/forgot"}
            className="text-indigo-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md font-semibold transition duration-300"
        >
          Login
        </button>
        <p className="text-sm text-center mt-5 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign Up Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
