import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Favourite = () => {
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      const favouriteIds = JSON.parse(localStorage.getItem("favourites")) || [];
      const fetched = [];

      for (const id of favouriteIds) {
        try {
          const res = await API.get(`/api/tenders/${id}`);
          fetched.push(res.data?.data || res.data);
        } catch (err) {
          console.error(`Failed to fetch tender ${id}`);
        }
      }

      setTenders(fetched);
    };

    fetchFavourites();
  }, []);

  const removeFavourite = (id) => {
    // Remove from localStorage
    const favouriteIds = JSON.parse(localStorage.getItem("favourites")) || [];
    const updatedFavourites = favouriteIds.filter(favId => favId !== id);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

    // Update state
    setTenders(tenders.filter(tender => tender._id !== id));
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Favourite Tenders</h1>
      {tenders.length === 0 ? (
        <p>No favourite tenders yet.</p>
      ) : (
        <ul className="space-y-4">
          {tenders.map((tender, index) => (
            <li key={tender._id} className="bg-white shadow p-4 rounded flex justify-between items-center">
              <div>
                <span className="font-semibold mr-2">{index + 1}.</span>
                <Link to={`/tenders/${tender._id}`} className="text-blue-600 hover:underline">
                  {tender.tenderDetails || "Untitled Tender"}
                </Link>
                <p className="text-sm text-gray-500">Tender No: {tender.tenderNo}</p>
              </div>
              <button
                onClick={() => removeFavourite(tender._id)}
                className="text-red-600 font-bold ml-4 hover:text-red-800"
                aria-label="Remove favourite"
                style={{ fontSize: "1.25rem", lineHeight: "1", cursor: "pointer", background: "none", border: "none" }}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favourite;
