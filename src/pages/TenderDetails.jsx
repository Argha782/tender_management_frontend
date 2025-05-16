import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "N/A";

const TenderDetails = () => {
  const { _id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || null;

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await API.get(`/tenders/${_id}`);
        const tenderData = res.data?.data || res.data; // Adjust based on your actual response
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

  if (loading) {
    return (
      <div className="p-5 text-center ">
        <p className="text-2xl">Loading tender details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-xl text-red-500">{error}</p>
        <Link
          to="/tenders"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Tenders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto pt-0">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {tender?.tenderDetails || "N/A"}
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Tender Number:</p>
            <p>{tender?.tenderNo || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p>{tender?.status || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Publish Date:</p>
            <p>{formatDate(tender?.publishDate)}</p>
          </div>
          <div>
            <p className="font-semibold">Submission Start Date:</p>
            <p>{formatDate(tender?.submissionStartDate)}</p>
          </div>

          <div>
            <p className="font-semibold">Tender End Date:</p>
            <p>{formatDate(tender?.tenderEndDate)}</p>
          </div>
          <div>
            <p className="font-semibold">Tender Opening Date:</p>
            <p>{formatDate(tender?.tenderOpeningDate)}</p>
          </div>

          <div>
            <p className="font-semibold">Pre-Bid Meeting Date:</p>
            <p>{formatDate(tender?.preBidMeetingDate)}</p>
          </div>


          
          <div>
            <p className="font-semibold">Price Bid Opening Date:</p>
            <p>{formatDate(tender?.priceBidOpeningDate)}</p>
          </div>

          <div>
            <p className="font-semibold">Work Type:</p>
            <p>{tender?.workType || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Authority Designation:</p>
            <p>{tender?.invitingAuthorityDesignation || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Authority Address:</p>
            <p>{tender?.invitingAuthorityAddress || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Tender Value:</p>
            <p>₹ {tender?.totalTenderValue || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Created By:</p>
            {/* <p className="font-semibold">Inviting Authority:</p> */}
            {/* <p>{tender?.createdBy || "N/A"}</p> */}
            {/* <p>{tender?.createdBy?.name || "N/A"}</p> */}
            <p>{tender?.createdBy ? `${tender.createdBy.firstName} ${tender.createdBy.lastName}` : "N/A"}</p>

          </div>
          {tender?.remarks && (
            <div>
              <p className="font-semibold">Remarks:</p>
              <p>{tender.remarks}</p>
            </div>
          )}
        </div>

        {tender?.documents?.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Documents:</p>
            <ul className="list-disc ml-6 space-y-1">
              {tender.documents.map((doc, index) => {
                const fileName =
                  doc.title ||
                  (doc.url
                    ? decodeURIComponent(doc.url.split("/").pop().split("?")[0])
                    : "Unknown Document");
                return (
                  <li key={index} className="flex items-center gap-2">
                    <span>📄</span>
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
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          to={role === "tenderowner" ? "/my-tenders" : "/tenders"}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
        >
          Back to Tenders List
        </Link>
      </div>
    </div>
  );
};

export default TenderDetails;
{
  /* <p className="font-semibold mb-2">Documents:</p>
            <ul className="list-disc ml-6 space-y-1">
              {tender.documents.map((url, index) => {
                const fileName = decodeURIComponent(url.split("/").pop().split("?")[0]);
                return (
                  <li key={index} className="flex items-center gap-2">
                    <span>📄</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words"
                    >
                      {fileName}
                    </a>
                  </li>
                );
              })}
            </ul> */
}
