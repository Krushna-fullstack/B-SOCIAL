import { Router } from "express";

const router = Router();

router.get("/profile/:username", getUserProfile);

export default router;
