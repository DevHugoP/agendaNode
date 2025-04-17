import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { CreateAppointmentInput } from "../schemas/appointement.schema";

export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "asc" },
    });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
  req: Request<{}, {}, CreateAppointmentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, client } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        client,
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
