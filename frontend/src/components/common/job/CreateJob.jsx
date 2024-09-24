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
    <div className="h-full w-80 mx-auto p-8 bg-white rounded-xl shadow-xl border border-gray-200 mb-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Create New Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label
            className="block text-sm font-semibold mb-2 text-gray-700"
            htmlFor="title"
          >
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-150"
            placeholder="Enter job title"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label
            className="block text-sm font-semibold mb-2 text-gray-700"
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
            className="input input-bordered w-full p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-150"
            placeholder="Enter location"
            required
          />
        </div>

        {/* Eligibility */}
        <div>
          <label
            className="block text-sm font-semibold mb-2 text-gray-700"
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
            className="input input-bordered w-full p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-150"
            placeholder="Enter eligibility criteria"
            required
          />
        </div>

        {/* Apply Link */}
        <div>
          <label
            className="block text-sm font-semibold mb-2 text-gray-700"
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
            className="input input-bordered w-full p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-150"
            placeholder="Enter apply link"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-150"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
