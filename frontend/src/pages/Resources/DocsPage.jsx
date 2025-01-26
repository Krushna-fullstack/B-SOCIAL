// DocsPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import resourcesData from "./../../utils/resoucesData/resourcesData.json";

const DocsPage = () => {
  const { department, honor } = useParams();
  const yearsData = resourcesData[department]?.[honor];

  if (!yearsData) {
    return (
      <p className="text-center text-lg">
        No data found for {honor} in {department}.
      </p>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 my-6">{honor}</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="flex flex-wrap justify-center">
        {Object.entries(yearsData).map(([year, resources]) => (
          <div
            key={year}
            className="md:w-96 w-full mx-4 mb-6 bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div className="px-6 py-4 bg-primary text-white">
              <h2 className="text-xl font-bold">{year}</h2>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc list-inside">
                {resources.map((resource, index) => (
                  <li key={index} className="list-none">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-700 font-semibold"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocsPage;
