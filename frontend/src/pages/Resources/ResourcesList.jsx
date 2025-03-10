import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import resourcesData from "./../../utils/resoucesData/resourcesData.json";
import { FaLongArrowAltRight } from "react-icons/fa";
import "./../../Styles/Resources.css";
import ShinyText from "../../ui-components/ShinyText";

const ResourcesList = () => {
  // State for selected filter
  const [selectedStream, setSelectedStream] = useState("All");

  // Initialize modal state based on localStorage
  const [showModal, setShowModal] = useState(() => {
    const shown = localStorage.getItem("resourceNoticeShown");
    console.log("Initial modal state from localStorage:", shown);
    return shown !== "true"; // Always show if it's null or not "true"
  });

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    localStorage.setItem("resourceNoticeShown", "true");
  };

  // Ensure the modal always appears on the first visit
  useEffect(() => {
    if (localStorage.getItem("resourceNoticeShown") === null) {
      setShowModal(true);
      localStorage.setItem("resourceNoticeShown", "false");
    }
  }, []);

  // Filtered data based on selected stream
  const filteredData =
    selectedStream === "All"
      ? resourcesData
      : { [selectedStream]: resourcesData[selectedStream] };

  return (
    <div className="flex flex-col justify-center relative">
      {/* Modal/Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Notice
              </h3>
              <p className="text-gray-600 mb-6">
                Some resources are currently unavailable. The resources will be
                featured soon.
              </p>
              <button
                onClick={handleModalClose}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <ShinyText
        text="E-Library"
        disabled={false}
        speed={3}
        className="custom-class text-5xl font-bold text-center my-4 mt-3"
      />

      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />

      {/* Filter Buttons */}
      <div className="flex overflow-x-auto space-x-4 mb-6 scrollbar-hide mx-4">
        {["All", "Arts", "Science", "Commerce"].map((stream) => (
          <button
            key={stream}
            className={`px-4 py-2 whitespace-nowrap rounded-lg text-white ${
              selectedStream === stream ? "bg-blue-600" : "bg-gray-500"
            } hover:bg-blue-700 transition-colors`}
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

