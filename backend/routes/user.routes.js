import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  getUserProfile,
  updateUser,
  followUnfollowUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, updateUser);

export default router;
