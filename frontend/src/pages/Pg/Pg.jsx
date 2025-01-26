import React, { useState } from "react";
import CreatePg from "./CreatePg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaLocationDot } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { AiFillMessage } from "react-icons/ai";
import ShinyText from "../../ui-components/ShinyText";
import toast from "react-hot-toast";

const Pg = () => {
  const [selectedPg, setSelectedPg] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const {
    data: pgs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pgs"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/pg/all");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message || "Something went wrong");
      }
    },
  });

  const { mutate: deletePg } = useMutation({
    mutationFn: async (pgId) => {
      const res = await fetch(`/api/v1/pg/${pgId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("PG deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pgs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePg = (pgId) => {
    deletePg(pgId);
  };

  const handleGetDetails = (pg) => {
    setSelectedPg(pg);
  };

  const handleCloseModal = () => {
    setSelectedPg(null);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <ShinyText
        text="PG / Hostels"
        disabled={false}
        speed={3}
        className="custom-class text-5xl font-bold text-center "
      />
      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />

      {authUser && authUser.isAdmin && <CreatePg />}

      {/* Display Loading Spinner */}
      {isLoading && (
        <div className="text-center mt-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Display Error Message */}
      {isError && (
        <div className="mt-4 text-red-500 text-center">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* Display PG Listings */}
      {pgs && pgs.length > 0 ? (
        <div className="flex flex-col items-center space-y-6 w-full max-w-xl mt-5">
          {pgs.map((pg) => (
            <div
              key={pg._id}
              className="card w-full bg-secondary shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden"
            >
              <div className="relative h-48 md:h-64">
                <img
                  src={pg.img}
                  alt={pg.name}
                  className="rounded-t-lg w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow flex items-center">
                  <LiaRupeeSignSolid className="mr-1 text-sm" />
                  {pg.pricePerMonth} / month
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-white">
                  {pg.name}
                </h2>
                <p className="text-sm text-white mb-4 flex items-center">
                  <FaLocationDot className="mr-1" />
                  <span>{pg.location}</span>
                </p>
                <p className="text-white line-clamp-3">{pg.description}</p>
                <div className="mt-4">
                  <p className="text-white font-semibold text-md">
                    Contact: {pg.contact}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <button
                    className="btn bg-primary border-none rounded-xl text-sm"
                    onClick={() => handleGetDetails(pg)}
                  >
                    <AiFillMessage /> Get Details
                  </button>
                  {authUser && authUser.isAdmin && (
                    <button
                      className="btn bg-red-600 border-none text-sm text-white ml-2"
                      onClick={() => handleDeletePg(pg._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="mt-6 text-gray-600 text-center">
            <p>No PGs available.</p>
          </div>
        )
      )}

      {/* Modal for PG Details */}
      {selectedPg && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-secondary p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
      <button
        className="absolute mx-3 my-3 top-2 right-2 bg-red-600 text-white p-2 rounded-full btn btn-sm btn-circle btn-ghost "
        onClick={handleCloseModal}
      >
        ✕
      </button>
      <h3 className="text-xl font-semi mb-4 mx-3 my-2">Details for {selectedPg.name}</h3>
      <ul className="list-disc list-inside mb-4 text-white">
        <li className="list-none">Step - 1 : Install telegram app</li>
        <li className="list-none">Step - 2 : Create an account</li>
        <li className="list-none">Step - 3 : Send Message to us </li>
      </ul>
      <button
        className="btn bg-primary text-white px-4 py-2 rounded-lg w-full"
        onClick={() => {
          window.location.href = `https://t.me/bjb_social?text=Hello,%20I%20am%20interested%20in%20learning%20more%20about%20the%20PG: ${selectedPg.name}`;
        }}
      >
        Continue
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Pg;
