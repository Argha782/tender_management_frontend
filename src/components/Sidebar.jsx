import { useEffect } from "react";
import { FaBars, FaFileAlt, FaUsers, FaBell, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  
   // ✅ Auto collapse sidebar on small screens
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  handleResize(); 
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
  return (
    <div className={`h-screen sticky left-0 top-0 bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      
      <nav className="flex items-center px-3 py-3 h-16 bg-gray-900 shadow">
        <img
          src="https://res.cloudinary.com/arghasaha/image/upload/v1763540753/AEGCL_logo_qyrfp7.jpg"
          className="h-9 w-9"
        />
        {isOpen && <span className="ml-4 text-3xl font-bold">AEGCL</span>}
      </nav>

      <div className="p-5">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl mb-10">
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
