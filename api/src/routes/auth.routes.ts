import express from 'express';
import * as authController from '../controllers/auth.controller';


const router = express.Router();

// Login route
router.post('/login',authController.loginUser);

export default router;
