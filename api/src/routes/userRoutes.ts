import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = express.Router();

// Get all users (for admin use)
router.get('/',authenticateJWT, userController.getAllUsers);

// Get a specific user by ID
router.get('/:id',authenticateJWT, userController.getUserById);

// Create a new user
router.post('/', userController.createUser);

// Update an existing user by ID
router.put('/:id',authenticateJWT, userController.updateUser);

// Delete a user by ID
router.delete('/:id',authenticateJWT, userController.deleteUser);

export default router;
