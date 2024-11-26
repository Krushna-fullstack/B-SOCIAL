import React, { useState } from "react";
import { Link } from "react-router-dom";
import resourcesData from "./../../utils/resoucesData/resourcesData.json";
import { FaLongArrowAltRight } from "react-icons/fa";

const ResourcesList = () => {
  // State for selected filter
  const [selectedStream, setSelectedStream] = useState("All");

  // Filtered data based on selected stream
  const filteredData =
    selectedStream === "All"
      ? resourcesData
      : { [selectedStream]: resourcesData[selectedStream] };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 pt-5 pb-3">
        Resources
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["All", "Science", "Commerce", "Arts"].map((stream) => (
          <button
            key={stream}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedStream === stream ? "bg-blue-600" : "bg-gray-500"
            } hover:bg-blue-700`}
            onClick={() => setSelectedStream(stream)}
          >
            {stream}
          </button>
        ))}
      </div>

      {/* Resources List */}
      {Object.entries(filteredData).map(([department, honors]) => (
        <div key={department} className="mb-2">
          <div className="flex flex-wrap justify-center">
            {Object.keys(honors).map((honor) => (
              <div
                key={honor}
                className="md:w-96 w-full mx-4 mb-6 bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="px-6 py-4 bg-primary text-white">
                  <h1 className="text-xl md:text-2xl font-bold">{honor}</h1>
                  <h2 className="text-sm md:text-lg text-white hover:text-indigo-700">
                    {department}
                  </h2>
                </div>
                <div className="px-6 py-4 flex">
                  <Link
                    to={`/docs/${department}/${honor}`}
                    className="text-indigo-500 hover:text-indigo-700 font-semibold text-md md:text-lg"
                  >
                    Explore the resources
                  </Link>
                  <FaLongArrowAltRight className="mt-1 ml-2 text-indigo-500 hover:text-indigo-700 font-semibold text-md md:text-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesList;
