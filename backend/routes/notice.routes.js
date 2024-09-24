import { Router } from "express";
import { isAdmin, protectRoute } from "../middlewares/protectRoute.js";
import {
  createNotice,
  deleteNotice,
  getAllNotices,
  likeUnlikeNotice,
} from "../controllers/notice.controller.js";

const router = Router();

router.get("/", protectRoute, getAllNotices);
router.post("/create", protectRoute, isAdmin, createNotice);
router.delete("/:id", protectRoute, isAdmin, deleteNotice);
router.post("/like/:id", protectRoute, likeUnlikeNotice);

export default router;
