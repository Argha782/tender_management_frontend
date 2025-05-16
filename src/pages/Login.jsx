import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;

      // Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Log firstName and lastName after login
      console.log(`${user.firstName} ${user.lastName} logged in`);
      console.log(`Role: ${user.role}`);

      // Redirect based on role
      if (user.role === "superadmin") {
        navigate("/dashboard");
      } else if (user.role === "tenderowner") {
        navigate("/dashboard");
      } else if (user.role === "vendor") {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Submit
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Sign Up Here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
