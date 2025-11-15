import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export interface IError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}

export const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 if no status code is set
  const statusCode = err.statusCode || 500;
  
  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] ${err.message}`);
  console.error(err.stack);

  // Don't leak error details in production
  const errorResponse: {
    success: boolean;
    message: string;
    errors?: ValidationError[];
    stack?: string;
  } = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Add validation errors if they exist
  if (err.errors && err.errors.length > 0) {
    errorResponse.errors = err.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// 404 Not Found middleware
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
