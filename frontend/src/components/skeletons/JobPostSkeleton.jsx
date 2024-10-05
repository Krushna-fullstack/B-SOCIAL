import React from "react";

const JobPostSkeleton = () => {
  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 mb-8 w-full max-w-3xl mx-auto animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-300 rounded-md w-2/3 mb-6"></div>

      {/* Location Skeleton */}
      <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-6"></div>

      {/* Eligibility Skeleton */}
      <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-6"></div>

      {/* Skeleton for Apply button */}
      <div className="h-12 bg-gray-300 rounded-md w-1/2 mx-auto"></div>
    </div>
  );
};

export default JobPostSkeleton;
