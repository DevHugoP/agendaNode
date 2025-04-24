import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { v4 as uuidv4 } from "uuid";
import { LoginUserInput, RegisterUserInput } from "../schemas/auth.schema";

// Endpoint: POST /auth/refresh-token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token manquant" });
      return;
    }
    const tokenInDb = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!tokenInDb || tokenInDb.revokedAt || tokenInDb.expiresAt < new Date()) {
      res.status(401).json({ error: "Refresh token invalide ou expiré" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: tokenInDb.userId } });
    if (!user) {
      res.status(401).json({ error: "Utilisateur non trouvé" });
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// Endpoint: POST /auth/logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    next(error);
  }
};

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

    // Access token JWT (15 min)
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

    // Refresh token UUID (7j)
    const refreshToken = uuidv4();
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // Stockage en DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpires,
      },
    });

    // Cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: refreshTokenExpires,
      path: "/",
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
