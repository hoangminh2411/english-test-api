import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleResponse } from '../utils/handleResponse';
import { validationResult } from 'express-validator';
import { handleError } from '../utils/errorHandler';

const userService = new UserService();

/**
 * Login User
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, errors,400);
    }

    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return handleError(res, new Error('Username and password are required'), 400);
    }

    // Find the user by username
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return handleError(res, new Error('Invalid credentials'),400);
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleError(res, new Error('Invalid credentials'),400);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    // Respond with the token
    handleResponse(res, 200, 'Login successful', { token });
  } catch (error) {
    handleError(res, error, 500)
  }
};
