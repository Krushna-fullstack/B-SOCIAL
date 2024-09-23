import { Router } from "express";
import { createJob, getAllJobs } from "../controllers/job.controller.js";
import { isAdmin, protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router
  .route("/")
  .post(protectRoute, isAdmin, createJob)
  .get(protectRoute, getAllJobs);

export default router;
