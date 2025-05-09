import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

export default router;
