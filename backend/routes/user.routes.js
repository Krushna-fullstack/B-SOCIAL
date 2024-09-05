import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.put("/update", protectRoute, updateUser);

export default router;
