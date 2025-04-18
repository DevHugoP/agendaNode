import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { CreateUserInput } from "../schemas/user.schema";

export const createUser = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, phone } = req.body;

    const user = await prisma.user.create({
      data: { email, name, phone },
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
