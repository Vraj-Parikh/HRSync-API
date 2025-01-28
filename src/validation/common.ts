import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.errors });
      } else {
        res.status(400).json({ error: err });
      }
    }
  };
