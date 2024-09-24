import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    eligibility: "",
    applyLink: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const queryClient = useQueryClient();

  const { mutate: createJob } = useMutation({
    mutationFn: async ({ title, location, eligibility, applyLink }) => {
      const res = await fetch("/api/v1/jobs", {
        method: "POST",
        body: JSON.stringify({ title, location, eligibility, applyLink }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Job created successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setFormData({
        title: "",
        location: "",
        eligibility: "",
        applyLink: "",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-lg pb-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter job title"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter location"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="eligibility"
          >
            Eligibility
          </label>
          <input
            type="text"
            id="eligibility"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter eligibility criteria"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="applyLink"
          >
            Apply Link
          </label>
          <input
            type="url"
            id="applyLink"
            name="applyLink"
            value={formData.applyLink}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter apply link"
            required
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary w-full">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
