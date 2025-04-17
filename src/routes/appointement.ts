import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../controllers/appointements.controller";
import validate from "../middlewares/validate";
import { createAppointmentSchema } from "../schemas/appointement.schema";

const router = express.Router();

router.get("/", getAllAppointments);

router.get("/:id", getAppointmentById);

router.post("/", validate(createAppointmentSchema), createAppointment);

export default router;
