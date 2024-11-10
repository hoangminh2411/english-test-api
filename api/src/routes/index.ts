import express from 'express';
import examRoutes from './examRoutes';
import answerRoutes from './answerRoutes';
import questionRoutes from './questionRoutes';
import resultRoutes from './resultRoutes';
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'

const router = express.Router();

// Use the routes
router.use('/answers', answerRoutes);
router.use('/questions', questionRoutes);
router.use('/users', userRoutes);
router.use('/exams', examRoutes); 
router.use('/results', resultRoutes); 
router.use('/auth', authRoutes);

export default router;
