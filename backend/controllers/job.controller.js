import asyncHandler from "../middlewares/asyncHandler.js";

import { Job } from "../models/job.model.js";

export const createJob = asyncHandler(async (req, res) => {
  const { title, location, eligibility, applyLink } = req.body;

  if (!title || !location || !eligibility || !applyLink) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  const job = await Job.create({
    title,
    location,
    eligibility,
    applyLink,
  });

  return res.status(201).json(job);
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });

  return res.status(200).json(jobs);
});

export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await job.deleteOne();

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});
