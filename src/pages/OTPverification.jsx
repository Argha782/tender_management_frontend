import React, { useContext, useState } from "react";
import API from "../services/api.js";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../context.jsx";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const { email, phoneNumber } = useParams();
  console.log("OTP Verification page rendered with params:", { email, phoneNumber });
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    const data = {
      email,
      otp: enteredOtp,
      phoneNumber,
    };
    await API
      // .post("http://localhost:5000/api/auth/otp-verification", data, {
      .post("/api/auth/otp-verification", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsAuthenticated(false);
        setUser(null);
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-indigo-700 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">OTP Verification</h1>
        <p className="mb-6 text-center text-gray-600">Enter the 5-digit OTP sent to your registered email or phone.</p>
        <form onSubmit={handleOtpVerification} className="flex flex-col items-center">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                key={index}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-semibold transition duration-300 w-full"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
