import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tenders from "./pages/Tenders";
import MyTenders from "./pages/MyTender.jsx";
import TenderDetails from "./pages/TenderDetails";
import Users from "./pages/User.jsx";
import MyProfile from "./pages/MyProfile.jsx";

import Unauthorized from "./components/Unauthorized";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TenderOwnerSidebar from "./components/TenderOwnerSidebar"; // Import your Tender Owner Sidebar
import PrivateRoute from "./components/PrivateRoute";


const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // assumes user object stored here
    setIsAuthenticated(!!token);
    setRole(user?.role || null);
  }, [location]);

  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  const renderSidebar = () => {
    if (role === "superadmin") return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    if (role === "tenderowner") return <TenderOwnerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    return null; // Vendors or other roles – no sidebar
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && isAuthenticated && (
        <div className="flex">
          {renderSidebar()}
          <div className="flex-1">
            <Navbar isOpen={isOpen} />
            <main className="p-5">{children}</main>
          </div>
        </div>
      )}
      {hideLayout && <main className="flex-1">{children}</main>}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["superadmin", "tenderowner", "vendor"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenders/:_id" element={<TenderDetails />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/users" element={<Users />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["tenderowner"]} />}>
            <Route path="/my-tenders" element={<MyTenders/>} />
          </Route>

          <Route path="/notifications" element={<h1>Notifications</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
