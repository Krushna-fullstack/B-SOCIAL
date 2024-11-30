import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
} from "../controllers/job.controller.js";
import { isAdmin, protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router
  .route("/")
  .post(protectRoute, isAdmin, createJob)
  .get(protectRoute, getAllJobs);

router.route("/:id").delete(protectRoute, isAdmin, deleteJob);

export default router;
