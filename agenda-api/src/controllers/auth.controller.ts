import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { LoginUserInput, RegisterUserInput } from "../schemas/auth.schema";

export const register = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const login = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Email ou mot de passe invalide" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ error: "Email ou mot de passe invalide" });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    next(error);
  }
};
