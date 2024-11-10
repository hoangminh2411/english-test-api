// utils/errorHandler.ts
import { Response } from 'express';
import { ValidationError } from 'sequelize';
import { handleResponse } from './handleResponse';

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof ValidationError) {
    return handleResponse(res, 400, 'Validation error', null, {
      errors: error.errors.map(err => ({ message: err.message, path: err.path })),
    });
  }

  // Handle 404 Not Found error
  if (error instanceof Error && error.message.includes('not found')) {
    return handleResponse(res, 404, 'Resource not found', null, {
      error: error.message,
    });
  }

  // Handle other generic errors
  handleResponse(res, 500, 'Internal server error', null, {
    error: error instanceof Error ? error.message : 'Unknown error',
  });
};
