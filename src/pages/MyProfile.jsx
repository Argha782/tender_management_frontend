import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
import toast from "react-hot-toast";

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Token used for API call:", token);
        const response = await API.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API response data:", response.data);
        setUser(response.data || {});
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error("Unauthorized: Please login again.");
        } else {
          toast.error("Failed to fetch profile");
        }
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.put(
        "/api/users/me",
        {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await API.put("/users/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password changed");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">My Profile</h2>
            <p className="text-gray-500">Manage your personal information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName || ""}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName || ""}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={!isEditing}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user.email || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber || ""}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Role</label>
            <input
              type="text"
              value={user.role || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 capitalize"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Department</label>
            <input
              type="text"
              value={user.department || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Designation</label>
            <input
              type="text"
              value={user.designation || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              disabled
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Account Created</label>
            <input
              type="text"
              value={
                user.createdAt ? new Date(user.createdAt).toLocaleString() : ""
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              disabled
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        <div className="border-t my-8"></div>

        <div className="mb-4">
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Change Password
            </button>
          ) : (
            <>
              <h3 className="text-xl font-semibold">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Current Password */}
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  disabled={
                    !passwords.currentPassword ||
                    !passwords.newPassword ||
                    !passwords.confirmPassword ||
                    passwords.newPassword !== passwords.confirmPassword
                  }
                >
                  Update Password
                </button>

                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswords({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
