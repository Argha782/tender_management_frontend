// src/components/LogoutButton.jsx
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    logout();
    console.log(`${firstName} ${lastName} logged out`);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
