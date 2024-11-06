import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// Get all users (for admin use)
router.get('/', userController.getAllUsers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Create a new user
router.post('/', userController.createUser);

// Update an existing user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

export default router;
