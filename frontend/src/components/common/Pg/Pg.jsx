import React from "react";
import CreatePg from "./CreatePg";
import { useQuery } from "@tanstack/react-query";
import { FaLocationDot } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";

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
    <div className="min-h-screen p-6 bg-black">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        PG / Hostel
      </h1>

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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {pgs.map((pg) => (
            <div
              key={pg._id}
              className="card bg-white shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={pg.img}
                  alt={pg.name}
                  className="rounded-t-lg w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow flex">
                <LiaRupeeSignSolid className="text-sm" />{pg.pricePerMonth} / month
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {pg.name}
                </h2>
                <p className="text-sm text-black mb-4 flex"><FaLocationDot className="mr-1" /><span>{pg.location}</span></p>
                <p className="text-gray-700 line-clamp-3">{pg.description}</p>
                <div className="mt-4">
                  <p className="text-gray-800 font-bold text-lg">
                    Contact: <a className="text-gray-800 font-bold text-lg">{pg.contact}</a>
                  </p>
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
    </div>
  );
};

export default Pg;
