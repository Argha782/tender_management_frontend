// import React, { useEffect, useState } from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import API from "../services/api";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const res = await API.get("/api/notifications", { withCredentials: true });
//       setNotifications(res.data.notifications);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await API.patch(`/api/notifications/${id}/read`, {}, { withCredentials: true });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {notifications.map((n) => (
//             <li
//               key={n._id}
//               className={`p-4 rounded-lg shadow ${
//                 n.isRead ? "bg-gray-100" : "bg-white border-l-4 border-blue-500"
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">{n.subject || "Notification"}</p>
//                   <p className="text-sm text-gray-600">{n.message}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     From: {n.sender?.name || "System"} | Type: {n.type}
//                   </p>
//                 </div>
//                 {!n.isRead && (
//                   <button
//                     onClick={() => markAsRead(n._id)}
//                     className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                   >
//                     Mark as Read
//                   </button>
//                 )}
//                 {n.isRead && <FaCheckCircle className="text-green-500" />}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;
// src/pages/NotificationsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api.js";
import { Context } from "../context.jsx"
import { formatDistanceToNow } from "date-fns";
import { BadgeCheck, Bell, MessageCircle, AlertTriangle, Mail } from "lucide-react";

const NotificationCard = ({ notification, onMarkRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case "query":
        return <MessageCircle className="text-yellow-500" />;
      case "response":
        return <BadgeCheck className="text-green-500" />;
      case "tender-update":
        return <Bell className="text-blue-500" />;
      case "system":
        return <AlertTriangle className="text-red-500" />;
      case "broadcast":
        return <Mail className="text-purple-500" />;
      default:
        return <Bell />;
    }
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg shadow-md ${
        notification.isRead ? "bg-white" : "bg-yellow-50"
      }`}
    >
      <div className="pt-1">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{notification.message}</p>
        <p className="text-xs text-gray-500">
          From: {notification.sender?.name || "System"} | Type: {notification.type}
        </p>
        {notification.tender && (
          <p className="text-xs text-gray-400">Tender No: {notification.tender?.tenderNo}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt))} ago
        </p>
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="text-xs mt-2 text-blue-600 hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

const Notifications = () => {
  const { user } = useContext(Context);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/read/${id}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications to show.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
