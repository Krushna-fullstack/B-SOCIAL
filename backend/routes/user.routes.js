import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  getUserProfile,
  updateUser,
  followUnfollowUser,
  searchUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, updateUser);
router.get("/search", searchUsers);

export default router;
