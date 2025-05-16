import { useState } from "react";
import { FaBars, FaFileAlt, FaUsers, FaBell, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (

<div className={`h-screen sticky left-0 top-0 ${isOpen ? "w-64" : "w-20"}`}>
<nav className="bg-gray-900 text-white flex justify-between items-center px-6 py-2 shadow h-16">
<a href="/dashboard" className="flex items-center space-x-5 rtl:space-x-reverse">
        <img src="AEGCL_logo.jpg" className="h-9 w-9" alt="AEGCL Logo" />
         <span className="self-center text-3xl font-bold whitespace-nowrap">
         AEGCL
        </span>
      </a>
</nav>
<div className="h-screen bg-gray-900 text-white p-5 transition-all">

      <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl mb-10">
        <FaBars />
      </button>
      <ul className="space-y-12 text-2xl">
        <li>
          <Link to="/dashboard" className="flex items-center space-x-4">
            <FaHome /> {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/tenders" className="flex items-center space-x-4">
            <FaFileAlt /> {isOpen && <span>Tenders</span>}
          </Link>
        </li>
        <li>
          <Link to="/users" className="flex items-center space-x-4">
            <FaUsers /> {isOpen && <span>Users</span>}
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="flex items-center space-x-4">
            <FaBell /> {isOpen && <span>Notifications</span>}
          </Link>
        </li>
      </ul>
    </div>
    </div>
  );
};

export default Sidebar;
