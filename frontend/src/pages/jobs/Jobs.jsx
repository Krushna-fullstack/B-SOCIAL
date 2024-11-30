import React, { useState } from "react";
import JobPost from "./JobPost";
import CreateJob from "./CreateJob";
import { useQuery } from "@tanstack/react-query";
import JobPostSkeleton from "../../components/skeletons/JobPostSkeleton";

const Jobs = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: jobs = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/v1/jobs");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  // State to manage the selected location filter
  const [selectedLocation, setSelectedLocation] = useState("");

  // Filtered jobs based on the selected location
  const filteredJobs = selectedLocation
    ? jobs.filter(
        (job) => job.location.toLowerCase() === selectedLocation.toLowerCase()
      )
    : jobs;

  // Extract unique locations from the job data for the dropdown
  const locations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h1 className="text-white mt-0 my-3 font-medium text-4xl">Jobs</h1>

      {authUser && authUser.isAdmin === true && (
        <CreateJob refetchJobs={refetch} />
      )}

      {/* Filter Dropdown */}
      <div className="mb-4 flex flex-col items-start">
        <label
          htmlFor="location-filter"
          className="text-white font-medium mb-2 sm:mb-0"
        >
          Filter by Location:
        </label>
        <div className="relative w-full">
          <select
            id="location-filter"
            className="w-full bg-secondary text-white px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 appearance-none cursor-pointer sm:text-base text-sm"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
            {/* <option value="Bhubaneswar">Bhubaneswar</option>
            <option value="Hyderbad">Hyderbad</option> */}
          </select>
          <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {(isLoading || isRefetching) && (
        <div>
          <JobPostSkeleton />
          <JobPostSkeleton />
          <JobPostSkeleton />
        </div>
      )}

      {/* No Jobs Found */}
      {!isLoading && !isRefetching && filteredJobs.length === 0 && (
        <p>No Jobs</p>
      )}

      {/* Displaying Filtered Jobs */}
      {!isLoading && !isRefetching && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobPost
              key={job._id}
              job={job}
              title={job.title}
              eligibility={job.eligibility}
              location={job.location}
              applyLink={job.applyLink}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
