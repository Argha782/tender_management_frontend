import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaCheckDouble,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import API from "../services/api";

const Dashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    ongoing: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/tenders");
        const data = response.data.data;

        const total = data.length;
        const open = data.filter(
          (t) => t.status.toLowerCase() === "open"
        ).length;
        const ongoing = data.filter(
          (t) => t.status.toLowerCase() === "ongoing"
        ).length;
        const completed = data.filter(
          (t) => t.status.toLowerCase() === "completed"
        ).length;

        setTenders(data);
        setStats({ total, open, ongoing, completed });
        setError(null);
      } catch (err) {
        setError("Failed to fetch tenders");
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3"];
  const tenderData = [
    { name: "Open", value: stats.open },
    { name: "Ongoing", value: stats.ongoing },
    { name: "Completed", value: stats.completed },
  ];

  if (loading)
    return (
      <div className="p-5 text-center text-2xl">Loading dashboard data...</div>
    );
  if (error) return <div className="p-5 text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<FaFileAlt size={28} />}
          title="Total Tenders"
          value={stats.total}
          color="bg-indigo-500"
        />
        <StatCard
          icon={<FaCheckCircle size={28} />}
          title="Open Tenders"
          value={stats.open}
          color="bg-green-500"
        />
        <StatCard
          icon={<FaClock size={28} />}
          title="Ongoing Tenders"
          value={stats.ongoing}
          color="bg-orange-500"
        />
        <StatCard
          icon={<FaCheckDouble size={28} />}
          title="Completed Tenders"
          value={stats.completed}
          color="bg-blue-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tenders Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tenderData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {tenderData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Tender Status Bar Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Tender Count">
                {tenderData.map((entry, index) => {
                  let fillColor = "#8884d8";
                  if (entry.name.toLowerCase() === "open")
                    fillColor = "#4CAF50"; // green
                  else if (entry.name.toLowerCase() === "ongoing")
                    fillColor = "#FF9800"; // orange
                  else if (entry.name.toLowerCase() === "completed")
                    fillColor = "#2196F3"; // blue
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tenders */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Tenders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Tender No</th>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {tenders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No tenders available.
                  </td>
                </tr>
              ) : (
                [...tenders]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((t, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{t.tenderNo || "N/A"}</td>
                      <td className="p-2">
                        {t.tenderDetails.trim() || "N/A"}
                      </td>
                      <td className="p-2 capitalize">
                        {t.status || "Unknown"}
                      </td>
                      <td className="p-2">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div
    className={`p-5 rounded-lg text-white shadow-md flex items-center space-x-4 ${color}`}
  >
    {icon}
    <div>
      <h3 className="text-md">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
