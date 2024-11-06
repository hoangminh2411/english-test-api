import express from 'express';
import examRoutes from './examRoutes';
import answerRoutes from './answerRoutes';
import questionRoutes from './questionRoutes';
import resultRoutes from './resultRoutes';
import userRoutes from './userRoutes'

const router = express.Router();

// Use the routes
router.use('/answers', answerRoutes);
router.use('/questions', questionRoutes);
router.use('/users', userRoutes);
router.use('/exams', examRoutes); // Add exam routes
router.use('/results', resultRoutes); // Add result routes

export default router;
