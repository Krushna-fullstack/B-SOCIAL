import { Router } from "express";
import { isAdmin, protectRoute } from "../middlewares/protectRoute.js";
import { createNotice } from "../controllers/notice.controller.js";

const router = Router();

router.post("/create", protectRoute, isAdmin, createNotice);

export default router;
