// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;




// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../../auth/AuthContext";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, token } = useContext(AuthContext);

//   if (!token) {
//     // 🛑 Not logged in
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     // 🛑 Logged in, but role not allowed
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // ✅ Logged in and allowed
//   return children;
// };

// export default PrivateRoute;
