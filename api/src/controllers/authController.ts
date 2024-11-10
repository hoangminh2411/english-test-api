import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleResponse } from '../utils/handleResponse';
import { validationResult } from 'express-validator';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, 400, 'Validation failed', { errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find the user by username
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return handleResponse(res, 401, 'Invalid credentials');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleResponse(res, 401, 'Invalid credentials');
    }

    // Generate a token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    // Return the token in response
    handleResponse(res, 200, 'Login successful', { token });
  } catch (error) {
    next({ status: 500, message: 'Failed to log in', error });
  }
};
