import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByUser,
} from "../controllers/appointements.controller";
import validate from "../middlewares/validate";
import { createAppointmentSchema } from "../schemas/appointement.schema";

const router = express.Router();

router.get("/", getAllAppointments);

router.get("/:id", getAppointmentById);

router.post("/", validate(createAppointmentSchema), createAppointment);

router.delete("/:id", deleteAppointment);

router.get("/user/:userId", getAppointmentsByUser);

export default router;
