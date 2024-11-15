// ResourcesList.jsx
import React from "react";
import { Link } from "react-router-dom";
import resourcesData from "./../../utils/resoucesData/resourcesData.json";

const ResourcesList = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 pt-5 pb-3">
        Resources
      </h1>
      {Object.entries(resourcesData).map(([department, honors]) => (
        <div key={department} className="mb-10">
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
                <div className="px-6 py-4">
                  <Link
                    to={`/docs/${department}/${honor}`}
                    className="text-indigo-500 hover:text-indigo-700 font-semibold text-md md:text-lg"
                  >
                    See Docs
                  </Link>
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
