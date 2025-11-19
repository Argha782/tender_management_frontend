
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context.jsx";
import { LogOut, UserCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-blue-900 border-b p-4 shadow flex justify-between items-center h-16">
      <Link to="/" className="text-xl text-white cursor-pointer">
        <h1 className="text-xl font-semibold">AEGCL Tender Portal</h1>
      </Link>

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
