import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://tender-management-backend.onrender.com/api", 
  // withCredentials: true, // Only needed if using cookies
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired, please login again.");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (!error.response) {
      alert("Server is not responding. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default API;
