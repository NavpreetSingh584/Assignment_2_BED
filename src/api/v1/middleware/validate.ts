import { Request, Response, NextFunction } from "express";
import Joi from "joi";

type Location = "body" | "query" | "params";

export const validate =
  (schema: Joi.ObjectSchema, where: Location = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate((req as any)[where], {
      abortEarly: false,      
      stripUnknown: true,     
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join(".") || "(root)",
        message: d.message,
      }));
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details,
      });
    }

    (req as any)[where] = value;
    next();
  };

export const requireIdParam = (paramName: string = "id") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.params[paramName]) {
      return res.status(400).json({
        status: "error",
        message: `Missing path param: ${paramName}`,
      });
    }
    next();
  };
