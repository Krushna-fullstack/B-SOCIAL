import React from "react";
import CreatePg from "./CreatePg";
import { useQuery } from "@tanstack/react-query";

const Pg = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">PG Listings</h1>

      <CreatePg />

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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.map((pg) => (
            <div
              key={pg._id}
              className="card bg-white shadow-lg rounded-lg p-4"
            >
              <img
                src={pg.img}
                alt={pg.name}
                className="rounded-lg h-48 w-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{pg.name}</h2>
              <p className="text-gray-600">{pg.location}</p>
              <p className="text-gray-800 mt-2">{pg.description}</p>
              <p className="text-lg font-bold mt-2">
                Price: ${pg.pricePerMonth} / month
              </p>
              <p className="text-gray-600 mt-1">Contact: {pg.contact}</p>
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
    </div>
  );
};

export default Pg;
