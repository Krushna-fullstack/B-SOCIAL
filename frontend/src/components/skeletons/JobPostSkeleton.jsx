import React from "react";

const JobPostSkeleton = () => {
  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-4 mb-6 w-full max-w-md mx-auto animate-pulse">
      <div className="flex flex-col gap-3 mb-4">
        {/* Title Skeleton */}
        <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>

        {/* Location Skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>

        {/* Eligibility Skeleton */}
        <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
      </div>

      {/* Apply Button Skeleton */}
      <div className="h-10 bg-gray-300 rounded-md w-full"></div>
    </div>
  );
};

export default JobPostSkeleton;
