// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { LogOut, UserCircle2 } from "lucide-react";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   return (
// <nav className="sticky top-0 w-full z-50 bg-blue-900 border-b p-4 shadow flex justify-between items-center h-16">
//       <div className="text-xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
//         ASSAM ELECTRICITY GRID CORPORATION
//       </div>
//       <div className="text-lg font-semibold text-white cursor-pointer hover:underline" onClick={() => navigate("/")}>
//             Home
//       </div>
      // {isAuthenticated && (
        // <div className="relative">
        //   <UserCircle2
        //     className="w-12 h-12 cursor-pointer text-white"
        //     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        //   />
      //     {isDropdownOpen && (
      //       <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
      //       <ul className="py-1 text-xl">
              // <li
              //   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              //   onClick={() => {
              //     navigate("/profile");
              //     setIsDropdownOpen(false);
              //   }}
              // >
              //   My Profile
              // </li>
              // <li>
              //   <button
              //   onClick={handleLogout}
              //   className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
              // >
              //   <LogOut className="w-6 h-6 mr-2" />
              //   Log Out
              // </button>
              // </li>
      //       </ul>
      //     </div>
      //     )} 
      //   </div>
      // )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context.jsx";
import { LogOut, UserCircle2 } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-blue-900 border-b p-4 shadow flex justify-between items-center h-16">
      <Link to="/" className="text-xl text-white cursor-pointer">
        <h1 className="text-xl font-semibold">AEGCL Tender Portal</h1>
      </Link>

      {/* <div className="relative"> */}
        {isAuthenticated ? (
          <div className="relative">
          <UserCircle2
            className="w-12 h-12 cursor-pointer text-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
            <ul className="py-1 text-xl">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                  setIsDropdownOpen(false);
                }}
              >
                My Profile
              </li>
              <li>
                <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
              >
                <LogOut className="w-6 h-6 mr-2" />
                Log Out
              </button>
              </li>
            </ul>
          </div>
          )}
        </div>
      ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register
            </Link>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
