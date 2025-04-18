import express from "express";
import { login, register } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(registerUserSchema), register);

router.post("/login", validate(loginUserSchema), login);

export default router;
