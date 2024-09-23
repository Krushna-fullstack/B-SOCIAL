import React from "react";

const JobPost = ({ title, location, eligibility, applyLink }) => {
  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-md space-y-4">
      <h1 className="text-xl font-semibold text-primary">{title}</h1>
      <p className="text-sm text-gray-500">
        <span className="font-bold">Location: </span>
        {location}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-bold">Eligibility: </span>
        {eligibility}
      </p>
      <a
        href={applyLink}
        target="_blank"
        rel="noopener noreferrer" // for security reasons
        className="inline-block mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary-focus transition-colors"
      >
        Apply Now
      </a>
    </div>
  );
};

export default JobPost;
