import api from "./api"; // adjust path as needed

export const registerUser = async (formData) => {
  return await api.post("/auth/register", formData);
};

export const loginUser = async (formData) => {
  return await api.post("/auth/login", formData);
};
