import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/http-error.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(status).json({
    success: false,
    message
  });
};
