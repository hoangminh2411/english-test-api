import { Response } from 'express';
import { createResponse } from './responseUtil';

export const handleResponse = (res: Response, statusCode: number, message: string, data: any = null,error: any = null ) => {
  res.status(statusCode).json(createResponse(statusCode, message, data, error));
};
