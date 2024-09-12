import React from "react";
import { Link } from "react-router-dom";

const JobPost = ({ jobId, title, location, eligibility, applyLink }) => {
  return (
    <div className="bg-black">
      <div className="max-w-sm mx-auto bg-secondary shadow-lg rounded-lg overflow-hidden my-2">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white mb-4">
            <span className="font-normal">Location: {location}</span>
          </p>
          <p className="text-white mb-4">
            <span className="font-normal">Eligibilty : {eligibility}</span>
          </p>
          <Link
            className="bg-black text-white font-semibold px-4 py-2 rounded transition-all mx-auto block text-center w-32"
            to={applyLink}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
