import api from "../services/api.js"
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "vendor",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      const res = await api.post("/auth/register", formData);
      alert("User registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-blue-900 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-[350px]"
      >
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="tenderowner">Tender Owner</option>
          <option value="vendor">Vendor</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Submit
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login Here</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
