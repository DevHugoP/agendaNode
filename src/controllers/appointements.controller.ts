import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { CreateAppointmentInput } from "../schemas/appointement.schema";
import "../types/express-ext";

export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId },
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
): Promise<void> => {
  try {
    const { date, client } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        client,
        userId,
      },
    });

    res.status(201).json(appointment);
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });
    console.log("test");

    if (!appointment || appointment.userId !== userId) {
      res.status(404).json({ error: "Rendez-vous introuvable" });
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment || appointment.userId !== userId) {
      res.status(404).json({ error: "Rendez-vous introuvable" });
      return;
    }

    const deleted = await prisma.appointment.delete({ where: { id } });

    res.status(200).json({
      message: `Rendez-vous ${id} supprimé.`,
      deleted,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Rendez-vous introuvable" });
      return;
    }

    next(error);
  }
};
