// export default Notifications;
import { useContext, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Context } from "../context";
import API from "../services/api.js";
import { toast } from "react-toastify";
import {
  Bell,
  AlertTriangle,
  Trash2,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

const Notifications = () => {
  const { user } = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    type: "TENDER_UPDATE",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, notifications]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/api/notifications");
      console.log("Fetched notifications:", data);
      const notes = data.notifications || data; // fallback
      setNotifications(notes);
      setFilteredNotifications(notes);
    } catch (e) {
      toast.error("Failed to fetch notifications");
    }
  };
  const handleCreate = async () => {
    if (!formData.subject || !formData.message) {
      toast.error("Subject and message are required");
      return;
    }
    try {
      await API.post("/api/notifications", formData);
      toast.success("Notification created!");
      setShowForm(false);
      setFormData({ subject: "", message: "", type: "TENDER_UPDATE" });
      fetchNotifications();
    } catch (e) {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/notifications/${id}`);
      toast.success("Deleted");
      fetchNotifications();
    } catch {
      toast.error("Not authorized or failed to delete");
    }
  };

  const handleSearch = (term) => {
    const filtered = notifications.filter((n) => {
      const subject = n.subject || "";
      const message = n.message || "";
      return (
        subject.toLowerCase().includes(term.toLowerCase()) ||
        message.toLowerCase().includes(term.toLowerCase())
      );
    });
    setFilteredNotifications(filtered);
  };

  const canDelete = (note) =>
    user.role === "superadmin" || note.sender?._id === user._id;

  const renderIcon = (type) => {
    return type === "SYSTEM" ? (
      <AlertTriangle className="text-red-500" />
    ) : (
      <Bell className="text-blue-500" />
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {(user.role === "superadmin" || user.role === "tenderowner") && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="mr-2" size={18} />
            Add Notification
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded-md shadow-sm focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        {searchTerm && (
          <XCircle
            size={18}
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-md space-y-3 border">
          {user.role === "superadmin" && (
            <select
              className="w-full p-2 border rounded"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="SYSTEM">System Update</option>
              <option value="TENDER_UPDATE">Tender Update</option>
            </select>
          )}

          <input
            placeholder="Subject"
            className="w-full p-2 border rounded"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          />
          <textarea
            placeholder="Message"
            className="w-full p-2 border rounded"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Submit Notification
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((note) => (
            <div
              key={note._id}
              className="bg-white border rounded-md p-4 shadow-sm flex justify-between items-start"
            >
              <div className="flex gap-3 items-start">
                {renderIcon(note.type)}
                <div>
                  <p className="font-semibold text-lg">{note.subject}</p>
                  <p className="text-gray-700">{note.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    By: {note.sender?.name || "System"} •{" "}
                    {note.type.replace("_", " ")}
                    <br />
                    {formatDistanceToNow(new Date(note.createdAt), {
                      addSuffix: true,
                    })}{" "}
                    • {format(new Date(note.createdAt), "hh:mm:ss a")}
                  </p>
                </div>
              </div>
              {(user.role === "superadmin" || user.role === "tenderowner") && (
                <button onClick={() => handleDelete(note._id)}>
                  <Trash2 className="text-red-500 hover:text-red-700" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
