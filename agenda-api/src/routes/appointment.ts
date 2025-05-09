import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../controllers/appointments.controller";
import { authenticate } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createAppointmentSchema } from "../schemas/appointment.schema";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createAppointmentSchema),
  createAppointment
);
router.get("/", authenticate, getAllAppointments);
router.get("/:id", authenticate, getAppointmentById);
router.delete("/:id", authenticate, deleteAppointment);

export default router;
