import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Context, ContextProvider } from "./context.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import PublicTenders from "./pages/PublicTenders.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import OtpVerification from "./pages/OTPverification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Tenders from "./pages/Tenders";
import MyTenders from "./pages/MyTender.jsx";
import TenderDetails from "./pages/TenderDetails";
import Users from "./pages/User.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Notifications from "./pages/Notification";
import Favourites from "./pages/Favourites";

import Unauthorized from "./components/Unauthorized";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TenderOwnerSidebar from "./components/TenderOwnerSidebar"; // Import your Tender Owner Sidebar
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Homepage.jsx";


const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { isAuthenticated, user } = useContext(Context);
  const role = user?.role;

  const location = useLocation();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const user = JSON.parse(localStorage.getItem("user")); // assumes user object stored here
  //   setIsAuthenticated(!!token);
  //   setRole(user?.role || null);
  // }, [location]);

  const path = location.pathname;
  

  // const hideLayout =
  //   path === "/login" ||
  //   path === "/password/forgot" ||
  //   path === "/password/reset/:token" ||
  //   path === "/otp-verification/:email/:phoneNumber" ||
  //   path === "/register";
    // path === "/"; //  Exclude layout on Public Tenders page

     const hideLayout =
    path === "/" ||
    path === "/login" ||
    path === "/password/forgot" ||
    path.startsWith("/password/reset/") ||
    path.startsWith("/otp-verification/") ||
    path === "/register" ||
    path.startsWith("/tenders/");
    
    const isNotificationPage = path === "/notifications";

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
    <ContextProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/" element={<div>Hello World</div>} /> */}
            <Route path="/" element={<Home/>} />
            <Route path="/tenders/:_id" element={<TenderDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/otp-verification/:email/:phoneNumber"
              element={<OtpVerification />}
            />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="*" element={<div>Fallback: Page not found or crashed</div>} />
            {/* Public Notifications Route (with layout adjusted by role) */}
            <Route path="/notifications" element={<Notifications />} />


            {/* Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["superadmin", "tenderowner", "vendor"]} />}>
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<MyProfile />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/users" element={<Users />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["tenderowner"]} />}>
              <Route path="/my-tenders" element={<MyTenders/>} />
            </Route>

            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Layout>
        <ToastContainer theme="colored" />
      </Router>
    </ContextProvider>
  );
};

export default App;
