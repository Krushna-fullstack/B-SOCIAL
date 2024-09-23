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
  const jobs = await Job.find();

  return res.status(200).json(jobs);
});
