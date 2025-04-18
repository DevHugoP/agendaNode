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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        client,
        userId,
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

export const deleteAppointment = async (
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

    const deleted = await prisma.appointment.delete({
      where: { id },
    });

    res.status(200).json({
      message: `Appointment with ID ${id} deleted.`,
      deleted,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    next(error);
  }
};

export const getAppointmentsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};
