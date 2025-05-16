import React, { useState, useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import API from "../services/api";

const Dashboard = () => {
  const [totalTenders, setTotalTenders] = useState(0);
  const [openTenders, setOpenTenders] = useState(0);
  const [ongoingTenders, setOngoingTenders] = useState(0);
  const [completedTenders, setCompletedTenders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        const response = await API.get("/tenders");
        const tenders = response.data.data;

        const total = tenders.length;
        const openCount = tenders.filter(t => t.status.toLowerCase() === "open").length;
        const ongoingCount = tenders.filter(t => t.status.toLowerCase() === "ongoing").length;
        const completedCount = tenders.filter(t => t.status.toLowerCase() === "completed").length;

        setTotalTenders(total);
        setOpenTenders(openCount);
        setOngoingTenders(ongoingCount);
        setCompletedTenders(completedCount);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tenders");
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const tenderData = [
    { name: "Open", value: openTenders },
    { name: "Ongoing", value: ongoingTenders },
    { name: "Completed", value: completedTenders },
  ];
  const COLORS = ["#4CAF50", "#FF9800", "#2196F3"];

  if (loading) {
    return <div className="p-5 text-center text-2xl">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tenders */}
        <div className="bg-blue-500 text-white p-5 rounded-lg flex items-center space-x-3">
          <FaFileAlt size={30} />
          <div>
            <h2 className="text-xl font-semibold">Total Tenders</h2>
            <p className="text-2xl">{totalTenders}</p>
          </div>
        </div>

        {/* Open Tenders */}
        <div className="bg-green-500 text-white p-5 rounded-lg flex items-center space-x-3">
          <FaCheckCircle size={30} />
          <div>
            <h2 className="text-xl font-semibold">Open Tenders</h2>
            <p className="text-2xl">{openTenders}</p>
          </div>
        </div>

        {/* Ongoing Tenders */}
        <div className="bg-orange-500 text-white p-5 rounded-lg flex items-center space-x-3">
          <FaClock size={30} />
          <div>
            <h2 className="text-xl font-semibold">Ongoing Tenders</h2>
            <p className="text-2xl">{ongoingTenders}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-10 flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={tenderData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {tenderData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
