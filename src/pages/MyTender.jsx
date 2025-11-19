import API from "../services/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";

const MyTenders = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [documentFile, setDocumentFile] = useState([{ title: "", file: null }]);
  const [existingDocuments, setExistingDocuments] = useState([]);

  // const user = JSON.parse(localStorage.getItem("user")); // or from context
  const [newTender, setNewTender] = useState({
    tenderNo: "",
    tenderDetails: "",
    publishDate: "",
    submissionStartDate: "",
    tenderEndDate: "",
    tenderOpeningDate: "",
    preBidMeetingDate: "",
    priceBidOpeningDate: "",
    workType: "",
    invitingAuthorityDesignation: "",
    invitingAuthorityAddress: "",
    totalTenderValue: "",
    status: "",
    remarks: "",
    // createdBy: user?.name || "", // set the creator's name from localStorage
  });

  const fetchMyTenders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/api/tenders/my-tenders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tenders = res.data.data;
      console.log("Tenders data: ", tenders);
      if (!Array.isArray(tenders)) {
        throw new Error("Invalid data format received from API");
      }
      setTenders(tenders);
    } catch (err) {
      console.error("Error fetching my tenders", err);
      alert("Failed to load your tenders. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTenders().catch((err) => {
      console.error("Unhandled error in fetchMyTenders:", err);
    });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewTender({ ...newTender, [e.target.name]: e.target.value });
  };

  const handleFileChange = (index, field, value) => {
    const updated = [...documentFile];
    updated[index][field] = value;
    setDocumentFile(updated);
  };

  const addDocumentField = () => {
    setDocumentFile((prev) => [...prev, { title: "", file: null }]);
  };

  const resetForm = () => {
    setNewTender({
      tenderNo: "",
      tenderDetails: "",
      publishDate: "",
      submissionStartDate: "",
      tenderEndDate: "",
      tenderOpeningDate: "",
      preBidMeetingDate: "",
      priceBidOpeningDate: "",
      workType: "",
      invitingAuthorityDesignation: "",
      invitingAuthorityAddress: "",
      totalTenderValue: "",
      status: "Open",
      remarks: "",
      // createdBy: user?.name || "", // set the creator's name from localStorage
    });
    setDocumentFile([]);
  };

  // returns error message string or null if valid
  const validateTender = () => {
    if (!newTender.tenderNo || newTender.tenderNo.length < 4) {
      alert("Tender No must be at least 4 characters long.");
      return false;
    }

    if (!newTender.tenderDetails || newTender.tenderDetails.length < 5) {
      alert("Tender Details must be at least 5 characters long.");
      return false;
    }

    // if (
    //    new Date(newTender.tenderOpeningDate)< new Date(newTender.tenderEndDate)
    // ) {
    //   alert("End date cannot be before opening date.");
    //   return false;
    // }

    return true;
  };
  // Add new tender to the list
  const addTender = async () => {
    const isValid = validateTender();
    if (!isValid) return;

    try {
      const formData = new FormData();

      Object.entries(newTender).forEach(([key, value]) => {
        formData.append(key, value);
      });

      documentFile.forEach((doc) => {
        if (doc.file) {
          formData.append("documents", doc.file);
        }
      });
      // Append document titles as JSON string
      const titles = documentFile.map(
        (doc) => doc.title || "Untitled Document"
      );
      formData.append("documentTitles", JSON.stringify(titles));

      for (var pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // const res = await API.post("http://localhost:5000/tenders", formData);
      const res = await API.post("/api/tenders", formData);
      // Instead of just updating local state, refetch tenders
      await fetchMyTenders();
      setShowForm(false); // Hide the form after adding
      resetForm();
    } catch (err) {
      console.error("Error adding tender", err);
      toast.error("Failed to add tender");
    }
  };

  // Function to save the edited tender

  const saveEditedTender = async () => {
    const isValid = validateTender();
    if (!isValid) return;

    try {
      //  Build FormData exactly like in addTender
      const formData = new FormData();
      Object.entries(newTender).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === "number" || typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value || "");
        }
      });

      // Add new documents
      documentFile.forEach((doc) => {
        console.log("📁 Document in edit:", doc);
        if (doc.file) {
          formData.append("documents", doc.file);
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Append document titles as JSON string
      // Add matching titles only for new files
      const titles = documentFile
        .filter((doc) => doc.file)
        .map((doc) => doc.title || "Untitled Document");
      formData.append("documentTitles", JSON.stringify(titles));

      // Append existing documents as JSON string to keep
      formData.append("existingDocuments", JSON.stringify(existingDocuments));

      //  Send multipart/form-data to backend
      const res = await API.put(`/api/tenders/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Instead of just updating local state, refetch tenders
      await fetchMyTenders();

      //  Reset UI state
      setEditMode(false);
      setShowForm(false);
      resetForm();
      setExistingDocuments([]);
      setDocumentFile([]);
    } catch (err) {
      console.error("Error updating tender", err);
      toast.error("Failed to update tender");
    }
  };

  // Function to edit a tender
  const editTender = (tender) => {
    setEditMode(true);
    setEditId(tender._id);
    setNewTender(tender);
    setExistingDocuments(tender.documents || []);
    // Initialize documentFile with one empty input if empty
    setDocumentFile([{ title: "", file: null }]);
    // setDocumentFile([]);
    setShowForm(true);
  };

  // Function to delete a tender
  const deleteTender = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tender?"
    );
    if (!confirmed) return;

    try {
      // New DELETE request to backend
      await API.delete(`/api/tenders/${_id}`);
      toast.success("Tender deleted.");
      // Update local state after successful deletion
      setTenders(tenders.filter((tender) => tender._id !== _id));
    } catch (err) {
      console.error("Error deleting tender", err);
      toast.error("Failed to delete tender");
    }
  };

  // Filter tenders based on search input
  const filteredTenders = tenders.filter((tender) => {
    if (!tender || !tender.tenderDetails) return false;
    try {
      return String(tender.tenderDetails)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // return String(tender.tenderNo)
    } catch (err) {
      console.error("Error filtering tender:", err, tender);
      return false;
    }
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Tender List</h1>

      {/* Add and Edit Tender Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setShowForm(!showForm);
          setEditMode(false); // Reset edit mode when canceling
          resetForm();
          setSearchTerm(""); // Clear search bar when toggling form
        }}
      >
        {showForm ? "Cancel" : "+ Add Tender"}
      </button>

      {/* Add Tender Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-2">
          <h2 className="text-xl font-semibold mb-2">
            {editMode ? "Edit Tender" : "New Tender"}
          </h2>
          <div className="grid grid-cols-1 md:grid-rows-2 p-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Tender No</label>
              <input
                type="text"
                name="tenderNo"
                placeholder="Tender No"
                onChange={handleChange}
                value={newTender.tenderNo}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Tender Details</label>
              <textarea
                name="tenderDetails"
                placeholder="Tender Details"
                onChange={handleChange}
                value={newTender.tenderDetails}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3.5">
            {/* Form Inputs */}

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                onChange={handleChange}
                value={newTender.publishDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Submission Start Date
              </label>
              <input
                type="date"
                name="submissionStartDate"
                onChange={handleChange}
                value={newTender.submissionStartDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Tender End Date
              </label>
              <input
                type="date"
                name="tenderEndDate"
                onChange={handleChange}
                value={newTender.tenderEndDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Tender Opening Date
              </label>
              <input
                type="date"
                name="tenderOpeningDate"
                onChange={handleChange}
                value={newTender.tenderOpeningDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Pre-Bid Meeting Date
              </label>
              <input
                type="date"
                name="preBidMeetingDate"
                onChange={handleChange}
                value={newTender.preBidMeetingDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Price Bid Opening Date
              </label>
              <input
                type="date"
                name="priceBidOpeningDate"
                onChange={handleChange}
                value={newTender.priceBidOpeningDate?.split("T")[0] || ""}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Work Type</label>
              <input
                type="text"
                name="workType"
                placeholder="Work Type"
                onChange={handleChange}
                value={newTender.workType}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Authority Designation
              </label>
              <input
                type="text"
                name="invitingAuthorityDesignation"
                placeholder="Authority Designation"
                onChange={handleChange}
                value={newTender.invitingAuthorityDesignation}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Authority Address
              </label>
              <input
                type="text"
                name="invitingAuthorityAddress"
                placeholder="Authority Address"
                onChange={handleChange}
                value={newTender.invitingAuthorityAddress}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Total Tender Value
              </label>
              <input
                type="number"
                name="totalTenderValue"
                placeholder="Total Tender Value"
                onChange={handleChange}
                value={newTender.totalTenderValue}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col gap-1 mb-3">
              <label className="text-sm font-medium mb-1">Documents</label>

              {documentFile.map((doc, index) => (
                <div key={index} className="document-entry">
                  <input
                    type="text"
                    placeholder="Document Title"
                    value={doc.title}
                    onChange={(e) =>
                      handleFileChange(index, "title", e.target.value)
                    }
                    className="mb-2"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(index, "file", e.target.files[0])
                    }
                  />
                  <button
                    onClick={() => {
                      const updatedFiles = [...documentFile];
                      updatedFiles.splice(index, 1);
                      setDocumentFile(updatedFiles);
                    }}
                    // className="text-red-600 font-bold"
                    title="Remove File"
                  >
                    ❌
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDocumentField}
                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 w-1/2"
              >
                + Add Document
              </button>
              {/* Display existing uploaded documents */}
              {existingDocuments.length > 0 && (
                <div className="existing-documents mt-4">
                  <h3 className="font-semibold mb-2">Existing Documents</h3>
                  {existingDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.title}
                      </a>
                      <button
                        onClick={() => {
                          const updatedExisting = [...existingDocuments];
                          updatedExisting.splice(idx, 1);
                          setExistingDocuments(updatedExisting);
                        }}
                        className="text-red-600 font-bold"
                        title="Remove Document"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                onChange={handleChange}
                value={newTender.status}
                className="p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Remarks</label>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                onChange={handleChange}
                value={newTender.remarks}
                className="p-2 border rounded col-span-2"
              />
            </div>
            {/* <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Inviting Authority
              </label>
              <div className="p-2 border rounded bg-gray-100 text-gray-800">
                {user?.name}
              </div>
            </div> */}
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={editMode ? saveEditedTender : addTender}
          >
            {editMode ? "Save Changes" : "Save Tender"}
          </button>
        </div>
      )}

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search tenders..."
        // className="w-full p-2 border rounded mb-4"
        className="mb-4 ml-5 p-2 border rounded w-full md:w-1/2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tender Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Tender No</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenders.map((tender) => (
            <tr key={tender._id} className="text-center">
              <td className="border p-2">{tender.tenderNo}</td>
              <td className="border p-2">{tender.tenderDetails}</td>
              <td className="border p-2">
                {new Date(tender.submissionStartDate).toLocaleDateString(
                  "en-GB"
                )}
              </td>
              <td className="border p-2">
                {new Date(tender.tenderEndDate).toLocaleDateString("en-GB")}
              </td>
              <td className="border p-2">{tender.status}</td>
              <td className="border p-2 space-x-2 flex justify-center">
                <button
                  aria-label="View Tender"
                  title="View Tender"
                  onClick={() => navigate(`/tenders/${tender._id}`)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  <FiEye size={18} />
                </button>
                <button
                  aria-label="Edit Tender"
                  title="Edit Tender"
                  onClick={() => editTender(tender)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  <FiEdit size={18} />
                </button>

                <button
                  aria-label="Delete Tender"
                  title="Delete Tender"
                  onClick={() => deleteTender(tender._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FiTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTenders;
