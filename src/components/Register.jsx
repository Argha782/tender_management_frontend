import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js"
import { toast } from "react-toastify";
import { Context } from "../context.jsx";

const Register = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    data.phoneNumber = `+91${data.phoneNumber}`;
    await API
      .post("/api/auth/register", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        toast.success(res.data.message);
        // navigateTo(`/otp-verification/${encodeURIComponent(data.email)}/${encodeURIComponent(data.phoneNumber)}`);
        navigateTo(`/otp-verification/${data.email}/${data.phoneNumber}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-700 min-h-screen flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit((data) => handleRegister(data))}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          {...register("firstName")}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          {...register("lastName")}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          {...register("email")}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          required
          {...register("phoneNumber")}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          {...register("password")}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="role"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          defaultValue="vendor"
          {...register("role")}
        >
          <option value="vendor">Vendor</option>
          <option value="tenderowner">Tender Owner</option>
        </select>
        <div className="mb-4">
          <p className="mb-2 font-semibold text-gray-700">Select Verification Method</p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="verificationMethod"
                value={"email"}
                {...register("verificationMethod")}
                required
                className="form-radio text-indigo-600"
              />
              <span>Email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="verificationMethod"
                value={"phoneNumber"}
                {...register("verificationMethod")}
                required
                className="form-radio text-indigo-600"
                disabled
              />
              <span>Phone</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md font-semibold transition duration-300"
        >
          Register
        </button>
        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login Here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
