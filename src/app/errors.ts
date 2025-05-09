/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import type { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";
import { NODE_ENV } from "../config";
import { CustomError } from "../errors/CustomError";
import { handleDuplicateError } from "../errors/duplicateErrors";
import {
  mongooseCastError,
  mongooseValidationError,
} from "../errors/validation.mongoose.error";
import { handleYupError } from "../errors/yupError";
import type { TErrors } from "../interfaces/error.interface";

/**
 * =========================== === === Global Error === === =====================
 */

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let status = 500;
  let message = "Something went wrong";
  const success = false;
  let stackTrace: any = NODE_ENV === "development" ? error.stack : null;
  let errors: TErrors = [
    {
      path: req.url,
      message: "Something went wrong",
    },
  ];
  /**
   * =========================== === === Custom  Error === === =====================
   */

  //  Final Error

  if (error instanceof Error) {
    message = error.message;
    errors = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  if (error instanceof CustomError) {
    status = error.status;
    message = error.message;
    errors = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  /**
   * =========================== === === CAST  Error === === =====================
   */

  if (error.name === "CastError") {
    status = 400;
    message = "Invalid ID";
    const simplified = mongooseCastError(error);
    errors = simplified;
  }

  /**
   * =========================== === === Zod  Error === === =====================
   */

  if (error instanceof ValidationError) {
    status = 400;
    message = "Validation Error";
    stackTrace = error.stack
      ? { ...stackTrace, stack: error.stack }
      : stackTrace;
    const simplified = handleYupError(error);

    errors = simplified;
  }

  /**
   * =========================== === === MOngoose   Error === === =====================
   */

  if (error.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
    const simplified = mongooseValidationError(error);
    errors = simplified;
  }

  if (error.code === 11000) {
    status = 400;
    message = "Data Duplication Error";
    const simplified = handleDuplicateError(error);
    errors = simplified;
  }

  res
    .status(status)
    .json({ status, success, message, errors, error, stackTrace });
  return;
};
