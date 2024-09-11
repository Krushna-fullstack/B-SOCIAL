import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.post("/create", protectRoute, createPost);

export default router;
