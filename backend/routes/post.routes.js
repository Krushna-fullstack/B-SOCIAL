import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

export default router;
