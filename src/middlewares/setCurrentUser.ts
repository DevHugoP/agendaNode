import { NextFunction, Request, Response } from "express";
import "../types/express-ext";

export const setCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.user = { id: 1 };
  next();
};
