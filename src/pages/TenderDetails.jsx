import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import API from "../services/api";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

const TenderDetails = () => {
  const { _id } = useParams();
  const [tender, setTender] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || null;

  const handleFavouriteToggle = () => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    if (isFavourite) {
      const updated = favourites.filter((fav) => fav !== _id);
      localStorage.setItem("favourites", JSON.stringify(updated));
    } else {
      favourites.push(_id);
      localStorage.setItem("favourites", JSON.stringify([...new Set(favourites)]));
    }
    setIsFavourite(!isFavourite);
  };

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await API.get(`/api/tenders/${_id}`);
        const tenderData = res.data?.data || res.data;
        if (tenderData) {
          setTender(tenderData);
        } else {
          setError("Tender not found");
        }
      } catch (err) {
        console.error("Error fetching tender:", err);
        setError("Failed to load tender details");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [_id]);
  
  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setIsFavourite(favourites.includes(_id));
  }, [_id]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <p className="text-2xl animate-pulse">Loading tender details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-xl text-red-500">{error}</p>
        <Link
          to="/tenders"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Tenders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-5xl mx-auto">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-4">
          <Link
            to="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
          >
            🏠 Home
          </Link>
          {role === "superadmin" || role === "tenderowner" ? (
            <Link
              to={role === "tenderowner" ? "/my-tenders" : "/tenders"}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
            >
              Back to Tenders List
            </Link>
          ) : user ? (
            <button
              onClick={handleFavouriteToggle}
              className={`flex items-center gap-2 px-5 py-2 rounded ${
                isFavourite
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-300 hover:bg-gray-400"
              } text-white`}
            >
              <Heart
                fill={isFavourite ? "white" : "none"}
                className="w-5 h-5"
              />
              Favourite
            </button>
          ) : null}
        </div>
        <a
          href="https://assamtenders.gov.in/nicgep/app"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          🔗 Assam Tenders Portal
        </a>
      </div>

      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-800">Tender</h1>

      {/* Tender Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border">
        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {tender?.tenderDetails || "N/A"}
        </h2> */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Info label="Tender Number" value={tender?.tenderNo} />
          <Info label="Tender Details" value={tender?.tenderDetails} />
          <Info label="Status" value={tender?.status} />
          <Info label="Publish Date" value={formatDate(tender?.publishDate)} />
          <Info
            label="Submission Start Date"
            value={formatDate(tender?.submissionStartDate)}
          />
          <Info
            label="Tender End Date"
            value={formatDate(tender?.tenderEndDate)}
          />
          <Info
            label="Tender Opening Date"
            value={formatDate(tender?.tenderOpeningDate)}
          />
          <Info
            label="Pre-Bid Meeting Date"
            value={formatDate(tender?.preBidMeetingDate)}
          />
          <Info
            label="Price Bid Opening Date"
            value={formatDate(tender?.priceBidOpeningDate)}
          />
          <Info label="Work Type" value={tender?.workType} />
          <Info
            label="Authority Designation"
            value={tender?.invitingAuthorityDesignation}
          />
          <Info
            label="Authority Address"
            value={tender?.invitingAuthorityAddress}
          />
          <Info
            label="Tender Value"
            value={
              tender?.totalTenderValue ? `₹ ${tender.totalTenderValue}` : "N/A"
            }
          />
          <Info
            label="Created By"
            value={
              tender?.createdBy?.firstName
                ? `${tender.createdBy.firstName} ${
                    tender.createdBy.lastName || ""
                  }`
                : "N/A"
            }
          />
          {tender?.remarks && <Info label="Remarks" value={tender.remarks} />}
        </div>

        {/* Documents Section */}
        {tender?.documents?.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">📎 Attached Documents</p>
            <ul className="list-disc ml-6 space-y-2 text-blue-700">
              {tender.documents.map((doc, index) => {
                const fileName =
                  doc.title ||
                  (doc.url
                    ? decodeURIComponent(doc.url.split("/").pop().split("?")[0])
                    : "Unknown Document");
                return (
                  <li key={index}>
                    <a
                      href={doc.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline break-all"
                    >
                      📄 {fileName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 Reusable Info Component
const Info = ({ label, value }) => (
  <div>
    <p className="font-medium text-gray-700">{label}:</p>
    <p className="text-gray-900">{value || "N/A"}</p>
  </div>
);

export default TenderDetails;
