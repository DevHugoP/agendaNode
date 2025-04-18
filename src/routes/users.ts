import express from "express";
import { createUser } from "../controllers/users.controller";
import validate from "../middlewares/validate";
import { createUserSchema } from "../schemas/user.schema";
import "../types/express-ext";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);

router.get("/me", (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.status(200).json({
    message: "Utilisateur connecté",
    userId: req.user.id,
  });
});

export default router;
