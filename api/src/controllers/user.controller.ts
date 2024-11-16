import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { handleResponse } from '../utils/handleResponse';
import bcrypt from 'bcrypt';
import { handleError } from '../utils/errorHandler';
import jwt from 'jsonwebtoken';
const userService = new UserService();

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    handleResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Get a specific user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return handleError(res, new Error('Invalid user ID'));
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return handleError(res, new Error('User not found'));
    }

    handleResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return handleError(res, new Error('Username and password are required'));
    }

    const existingUser = await userService.findUserByUsername(username);
    if (existingUser) {
      return handleError(res, new Error('Username already exists'));
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const newUser = await userService.createUser({
      username,
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    handleResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Update an existing user by ID
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return handleError(res, new Error('Invalid user ID'));
    }

    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      return handleError(res, new Error('User not found'));
    }

    handleResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
     handleError(res,error);
  }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return handleError(res, new Error('Invalid user ID'));
    }

    const deleted = await userService.deleteUser(userId);
    if (!deleted) {
      return handleError(res, new Error('User not found'));
    }

    handleResponse(res, 204, 'User deleted successfully');
  } catch (error) {
    handleError(res,error);
  }
};



export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const currentUser =req.user
    
    if (!currentUser) {
      return handleError(res, new Error('User not found'), 404);
    }
 
  
    // Respond with the user's data
    handleResponse(res, 200, 'User data retrieved successfully', currentUser);
  } catch (error) {
    handleError(res, error, 500);
  }
};