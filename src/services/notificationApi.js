import API from "./api";

// Notification API calls
export const fetchNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.patch("/notifications/" + id + "/read");
