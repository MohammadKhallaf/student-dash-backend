import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "yup";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const requestValidator = (schema: ObjectSchema<any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
