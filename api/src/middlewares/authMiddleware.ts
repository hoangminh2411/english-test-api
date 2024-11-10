// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwtPayload'; // Adjust the path to your JwtPayload type
import { handleResponse } from '../utils/handleResponse'; // Import handleResponse

export const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Bearer <token>

  if (!token) {
    return handleResponse(res, 401, 'Unauthorized: No token provided');
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err:any, user:any) => {
    if (err) {
      return handleResponse(res, 403, 'Forbidden: Invalid token');
    }

    // Cast 'user' to 'JwtPayload' and assign to req.user
    req.user = user as JwtPayload;

    next();
  });
};
