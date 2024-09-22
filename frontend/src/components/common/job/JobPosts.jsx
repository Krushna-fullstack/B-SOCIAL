import React from "react";
import JobPost from "./JobPost";

const JobPosts = () => {
  const jobData = [
    {
      jobID: 1,
      title: "Full Stack Developer",
      location: "Remote",
      eligibility: "BCA/MCA/B.Tech/M.Tech",
      applyLink: "https://www.facebook.com",
    },
    {
      jobID: 2,
      title: "Frontend Developer",
      location: "Bangalore",
      eligibility: "BCA/MCA/Bsc IT/Msc IT/Bsc CS",
      applyLink: "https://www.youtube.com/",
    },
    {
      jobID: 3,
      title: "Content Writer",
      location: "Hyderabad",
      eligibility: "BA/MA in English Literature",
      applyLink: "https://www.x.com",
    },
    {
      jobID: 4,
      title: "Graphic Designer",
      location: "Not Specified",
      eligibility: "2+ years of experience in Graphic Designing",
      applyLink: "https://www.netflix.com",
    },
    {
      jobID: 5,
      title: "Sales Executive",
      location: "Bhubaneswar",
      eligibility: "Bachelor's Degree",
      applyLink: "https://www.microsoft.com",
    },
  ];

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-4">Job Openings</h1>
      <p className="text-sm text-center text-white mb-4">
        Apply to the latest job openings according to your interest
      </p>
      <div className="w-full max-w-4xl space-y-6">
        {jobData.map((job) => (
          <JobPost
            key={job.jobID}
            jobID={job.jobID} // Pass jobID as a prop
            title={job.title}
            location={job.location}
            eligibility={job.eligibility}
            applyLink={job.applyLink}
          />
        ))}
      </div>
    </div>
  );
};

export default JobPosts;
