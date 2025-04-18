import { NextFunction, Request, Response } from "express";

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.id) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }

  res.status(200).json({
    message: "Utilisateur connecté",
    userId: req.user.id,
  });
};
