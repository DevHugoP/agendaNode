import express from "express";
import { login, register, refreshToken, logout } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(registerUserSchema), register);

router.post("/login", validate(loginUserSchema), login);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
