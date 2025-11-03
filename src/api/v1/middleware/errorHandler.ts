import { Request, Response, NextFunction } from "express";

/**
 * Global error-handling middleware
 * Logs the error and sends a structured JSON response.
 * Must be added as the LAST middleware in app.ts
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error details for debugging
  console.error("Unhandled Error:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Determine the HTTP status code
  const statusCode = err.status || err.statusCode || 500;

  // Standardized error response
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
