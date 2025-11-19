import React, { useEffect, useState, Fragment } from "react";
import API from "../services/api.js";
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    department: "",
    designation: "",
    role: "vendor",
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // console.log("Fetching users...");
        const res = await API.get("/api/users");
        // console.log("Users data:", res.data);
        const users = res.data.data; //  Get actual Users list

        console.log("Users data: ", users);
        if (!Array.isArray(users)) {
          throw new Error("Invalid data format received from API");
        }
        setUsers(users);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        alert("Error loading users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers().catch((err) => {
      console.error("Unhandled error in fetchUsers:", err);
    });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      department: "",
      designation: "",
      role: "vendor",
    });
  };

  const validateUser = () => {
    if (!newUser.firstName.trim() || !newUser.lastName.trim()) {
      alert("Please enter full name.");
      return false;
    }

    const emailExists = users.some(
      (u) => u.email === newUser.email && (!editMode || u._id !== editId)
    );
    if (emailExists) {
      alert("Email already in use.");
      return false;
    }

    if (!editMode && (!newUser.password || newUser.password.length < 6)) {
      alert("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  // Add new User to the list
  const addUser = async () => {
    const isValid = validateUser();
    if (!isValid) return;

    try {
      const res = await API.post("/api/users", newUser);
      setUsers([...users, res.data.data]);
      setShowForm(false); // Hide the form after adding
      resetForm();
      toast.success("User added successfully")
    } catch (err) {
      console.error("Error adding user", err);
      toast.error("Failed to add user");
    }
  };

  // Function to save the edited User
  const saveEditedUser = async () => {
    //  Build FormData exactly like in addUser
    // const formData = new FormData();

    // Object.entries(newUser).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });

    // documentFile.forEach((file) => {
    //   formData.append("documents", file);
    // });

    const isValid = validateUser();
    if (!isValid) return;

    const updatedUser = { ...newUser };
    if (!updatedUser.password) {
      delete updatedUser.password;
    } else if (updatedUser.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await API.put(`/api/users/${editId}`, updatedUser);

      //  Update local list using the returned record
      setUsers((prev) => prev.map((u) => (u._id === editId ? res.data : u)));

      //  Reset UI state
      setEditMode(false);
      setShowForm(false);
      resetForm();
      toast.success("User updated successfully");
    } catch (err) {
      console.error("Error updating user", err);
      toast.error("Failed to update user");
    }
  };

  // Function to edit a User
  const editUser = (user) => {
    setEditMode(true);
    setEditId(user._id);
    setNewUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "", // Do not show actual password — initialize to blank
      department: user.department || "",
      designation: user.designation || "",
      role: user.role || "vendor",
    });

    setShowForm(true);
    setSearch(""); // Clear search input when editing a user to fix autofill bug
  };

  // Function to delete
  const deleteUser = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/api/users/${_id}`);
      alert("User deleted.");
      setUsers(users.filter((user) => user._id !== _id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user");
    }
  };

  // View User activity
  const handleViewUserActivity = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/api/users/activity/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
      setOpenDialog(true);
    } catch (err) {
      console.error("Error loading user activity", err);
      alert("Failed to load user activity.");
    }
  };

  // Filter
  const filteredUsers = users.filter((user) =>
    [user.firstName, user.lastName, user.email].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>

      {/* Add and Edit User Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setShowForm(!showForm);
          setEditMode(false); // Reset edit mode when canceling
          resetForm();
          setSearch(""); // Clear search bar when toggling form
        }}
      >
        {showForm ? "Cancel" : "+ Add User"}
      </button>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-2">
          <h2 className="text-xl font-semibold mb-2">
            {editMode ? "Edit User" : "New User"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              required
              placeholder="First Name"
              className="border p-2 rounded"
            />
            <input
              name="lastName"
              value={newUser.lastName}
              onChange={handleInputChange}
              required
              placeholder="Last Name"
              className="border p-2 rounded"
            />
            <input
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
            />
            <input
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              required
              type="tel"
              placeholder="Phone Number"
              className="border p-2 rounded"
            />

            <div className="relative">
              <input
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                type={showPasswords.password ? "text" : "password"}
                placeholder="Password"
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
              >
                {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            >
              <option value="vendor">Vendor</option>
              <option value="tenderowner">Tender Owner</option>
            </select>
            <input
              name="department"
              value={newUser.department}
              onChange={handleInputChange}
              // required
              type="text"
              placeholder="Department"
              className="border p-2 rounded"
            />
            <input
              name="designation"
              value={newUser.designation}
              onChange={handleInputChange}
              // required
              type="text"
              placeholder="Designation"
              className="border p-2 rounded"
            />
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={editMode ? saveEditedUser : addUser}
          >
            {editMode ? "Save Changes" : "Save User"}
          </button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 ml-5 p-2 border rounded w-full md:w-1/2"
      />

      {/* Users Display */}
      {loading ? (
        <p className="p-5 text-center text-2xl">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="border p-4 rounded shadow bg-white relative"
            >
              <h2 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="mt-2">
                Role:{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    user.role === "tenderowner"
                      ? "bg-blue-600"
                      : user.role === "vendor"
                      ? "bg-green-900"
                      : "bg-gray-400"
                  }`}
                >
                  {user.role === "tenderowner"
                    ? "Tender Owner"
                    : user.role === "vendor"
                    ? "Vendor"
                    : "Super Admin"}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Registered: {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => editUser(user)}
                  className="text-green-600 hover:underline text-2xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-600 hover:underline text-2xl"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 space-x-2">
                <button
                  onClick={() => handleViewUserActivity(user._id)}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                >
                  Activity Log
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Transition appear show={openDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpenDialog(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    👤 User Activity Log
                  </DialogTitle>

                  {selectedUser ? (
                    <>
                      <div className="my-4">
                        <p className="text-md font-medium">
                          Name: {selectedUser.name} ({selectedUser.role})
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={`inline-block h-3 w-3 rounded-full mr-1 ${
                              selectedUser.isOnline
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {selectedUser.isOnline ? "Online" : "Offline"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Last Login:{" "}
                          {selectedUser.lastActiveAt
                            ? new Date(
                                selectedUser.lastActiveAt
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-semibold">
                                Tender No
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">
                                Last Updated
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">
                                Status
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedUser.tenders.map((tender) => (
                              <tr key={tender._id}>
                                <td className="px-4 py-2">{tender.tenderNo}</td>
                                <td className="px-4 py-2">
                                  {new Date(tender.updatedAt).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">{tender.status}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() =>
                                      navigate(`/tenders/${tender._id}`)
                                    }
                                    className="text-blue-600 hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600">Loading user data...</p>
                  )}

                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      onClick={() => setOpenDialog(false)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default User;
