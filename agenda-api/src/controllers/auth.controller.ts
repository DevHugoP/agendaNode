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

    // Vérification de l'existence de l'email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Un utilisateur avec cet email existe déjà." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du user ET du profil dans une transaction atomique
    const [user, profile] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
        },
      }),
      // Le profil est créé juste après avec le nom et l'email du user
      prisma.profile.create({
        data: {
          user: { connect: { email } },
          fullName: name,
          // On peut stocker l'email ici aussi si tu veux un champ email public
          // email: email,
        },
      })
    ]);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      token,
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
