import { Router } from "express";
import { isAdmin, protectRoute } from "../middlewares/protectRoute.js";
import { createPg, getAllPgs, deletePg } from "../controllers/pg.controller.js";

const router = Router();
router.get("/all", getAllPgs);
router.post("/create", protectRoute, isAdmin, createPg);
router.delete("/:id", protectRoute, isAdmin, deletePg);
export default router;
