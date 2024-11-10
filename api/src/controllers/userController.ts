import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { handleResponse } from '../utils/handleResponse';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    handleResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve users', error });
  }
};

// Get a specific user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }
    handleResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve user', error });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const newUser = await userService.createUser({
      username,
      password: hashedPassword, // Store the hashed password
      isAdmin,
    });

    handleResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    next({ status: 500, message: 'Failed to create user', error });
  }
};
// Update an existing user by ID
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
    if (!updatedUser) {
      return next({ status: 404, message: 'User not found' });
    }
    handleResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next({ status: 500, message: 'Failed to update user', error });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await userService.deleteUser(Number(req.params.id));
    if (!deleted) {
      return next({ status: 404, message: 'User not found' });
    }
    handleResponse(res, 204, 'User deleted successfully');
  } catch (error) {
    next({ status: 500, message: 'Failed to delete user', error });
  }
};
