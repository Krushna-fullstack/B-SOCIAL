import React from "react";
import JobPost from "./JobPost";
import CreateJob from "./CreateJob";
import { useQuery } from "@tanstack/react-query";
import JobPostSkeleton from "../../skeletons/JobPostSkeleton";
const JobPosts = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: jobs,
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

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h1 className="text-white mt-0 my-3 font-medium text-4xl">Jobs</h1>
      {authUser && authUser.isAdmin === true && <CreateJob />}

      {(isLoading || isRefetching) && (
        <div>
          <JobPostSkeleton />
          <JobPostSkeleton />
          <JobPostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && jobs.length === 0 && <p>No Jobs</p>}

      {!isLoading && !isRefetching && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <JobPost
              key={job._id}
              title={job.title}
              location={job.location}
              eligibility={job.eligibility}
              applyLink={job.applyLink}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPosts;
