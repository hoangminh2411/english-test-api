import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/responseUtil';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  const statusCode = error.status || 500;
  const message = error.message || 'An unexpected error occurred';

  res.status(statusCode).json(createResponse(statusCode, message, null, error));
};
