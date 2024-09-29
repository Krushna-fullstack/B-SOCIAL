import React from "react";

const JobPostSkeleton = () => {
  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-4 mb-6 w-full max-w-sm mx-auto animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-60 h-12 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-300 rounded-md w-24"></div>
          <div className="h-3 bg-gray-200 rounded-md w-16"></div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 rounded-md w-full"></div>
        <div className="h-3 bg-gray-300 rounded-md w-5/6"></div>
      </div>

      <div className="h-32 bg-gray-300 rounded-lg"></div>

      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-gray-300 rounded-md w-16"></div>
        <div className="h-6 bg-gray-300 rounded-md w-16"></div>
        <div className="h-6 bg-gray-300 rounded-md w-16"></div>
      </div>
    </div>
  );
};

export default JobPostSkeleton;
