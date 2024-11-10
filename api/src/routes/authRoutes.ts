import express from 'express';
import * as authController from '../controllers/authController';


const router = express.Router();

// Login route
router.post('/login',authController.loginUser);

export default router;
