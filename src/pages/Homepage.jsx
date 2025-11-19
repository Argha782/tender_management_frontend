import React, { useEffect, useState, useContext } from "react";
import { FaDownload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import API from "../services/api";
import { UserCircle2, LogOut } from "lucide-react";
import { Context } from "../context.jsx";

const Home = () => {
  const [tenders, setTenders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, setUser } = useContext(Context);
  const isAuthenticated = !!user;

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        // const res = await API.get("/");
        const res = await API.get("/api/tenders");
        console.log("Fetched tenders:", res.data);
        setTenders(res.data.data); // Make sure this is an array
      } catch (err) {
        console.error("Failed to fetch tenders", err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await API.get("/api/notifications");
        if (res.data.success) {
          setNotifications(res.data.notifications || []); // ✅ Correct key
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchTenders();
    fetchNotifications();
  }, []);


  // Filter tenders based on search input
  const filteredTenders = tenders.filter((tender) => {
    if (!tender || !tender.tenderDetails) return false;
    try {
      return (
        String(tender.tenderDetails)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(tender.tenderNo).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (err) {
      console.error("Error filtering tender:", err, tender);
      return false;
    }
  });

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "60px",
      sortable: false,
    },
    {
      name: "Tender No",
      selector: (row) => row.tenderNo,
      sortable: true,
      wrap: true,
      width: "180px",
      cell: (row) => (
        <Link
          to={`/tenders/${row._id}`}
          className="text-blue-600 hover:underline"
        >
          {row.tenderNo}
        </Link>
      ),
    },
    {
      name: "Tender Details",
      selector: (row) => row.tenderDetails,
      sortable: true,
      wrap: true,
      width: "250px",
    },
    // {
    //   name: "Department",
    //   selector: (row) => row.department || "N/A",
    //   sortable: true,
    // },
    {
      name: " Submission Start Date",
      selector: (row) => new Date(row.submissionStartDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Tender End Date",
      selector: (row) => new Date(row.tenderEndDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.status === "Open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Download",
      cell: (row) =>
        row.documents && row.documents.length > 0 ? (
          <div className="flex flex-col gap-1">
            {row.documents.map((doc, index) => {
              const fileName =
                doc.title ||
                (doc.url
                  ? decodeURIComponent(doc.url.split("/").pop().split("?")[0])
                  : "Unknown Document");
              return (
                <li key={index} className="flex items-center gap-2">
                  <FaDownload className="text-sm" />
                  <a
                    href={doc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                  >
                    {fileName}
                  </a>
                </li>
              );
            })}

            {/* {row.documents.map((doc, index) => (
              <a
                key={index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <FaDownload className="text-sm" />
                {doc.name || `Document ${index + 1}`}
              </a>
            ))} */}
          </div>
        ) : (
          "N/A"
        ),
      // grow: 2,
      wrap: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="https://res.cloudinary.com/arghasaha/image/upload/v1763540753/AEGCL_logo_qyrfp7.jpg" alt="AEGCL Logo" className="h-10"/>
          <h1 className="text-xl font-semibold">AEGCL Tender Portal</h1>
        </div>

        {isAuthenticated ? (
          <div className="relative">
            <UserCircle2
              className="w-12 h-12 cursor-pointer text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                <ul className="py-1 text-xl">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    My Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Dashboard
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                    >
                      <LogOut className="w-6 h-6 mr-2" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition">
              Register / Login
            </button>
          </Link>
        )}
      </nav>

      {/* News & Notifications Section */}
      <div className="relative bg-white border border-yellow-300 shadow-md rounded-md mb-6 overflow-hidden">
        <div className="flex justify-between items-center bg-yellow-100 px-4 py-2">
          <h3 className="text-lg font-semibold text-yellow-900">
            📢 News & Notifications
          </h3>
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate("/notifications");
              } else {
                navigate("/login");
              }
            }}
            className="text-sm text-blue-700 font-medium hover:underline"
          >
            View All
          </button>
        </div>

        {/* Marquee Content */}
        <div className="relative h-10 overflow-hidden bg-white">
          <ul className="absolute whitespace-nowrap animate-scroll-left flex gap-12 px-4 text-sm text-gray-800 items-center h-full">
            {notifications.map((note, index) => (
              <li key={index} className="whitespace-nowrap">
                <strong className="text-blue-600">{note.subject}:</strong>{" "}
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Tenders</h2>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={() => navigate("/favourites")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Favourites
              </button>
            )}
            <input
              type="text"
              placeholder="Search by Tender No or Details"
              className="border p-2 rounded w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredTenders}
          pagination
          highlightOnHover
          responsive
          striped
          defaultSortField="startDate"
          persistTableHead
          noDataComponent="No tenders available"
        />
      </div>
    </div>
  );
};

export default Home;
