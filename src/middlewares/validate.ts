import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({ body: req.body });
      return next();
    } catch (e: any) {
      res.status(400).json({
        error: "Invalid request",
        details: e.errors,
      });
    }
  };
};

export default validate;
