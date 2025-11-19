import axios from "axios";

// Dynamically use backend URL from environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // withCredentials: true, // Uncomment if you use cookies
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // ⚠️ Prevent session expired alert for login route
    const isAuthRoute = url?.includes("/auth/login") || url?.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      // Only show session expired for protected routes
      alert("Session expired, please login again.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (!error.response) {
      alert("Server is not responding. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default API;
