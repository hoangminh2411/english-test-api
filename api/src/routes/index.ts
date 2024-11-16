import express from 'express';
import examRoutes from './exam.routes';
import answerRoutes from './answer.routes';
import questionRoutes from './question.routes';
import resultRoutes from './result.routes';
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import examAttempt from './exam-attempt.routes'

const router = express.Router();

// Use the routes
router.use('/answers', answerRoutes);
router.use('/questions', questionRoutes);
router.use('/users', userRoutes);
router.use('/exams', examRoutes); 
router.use('/results', resultRoutes); 
router.use('/auth', authRoutes);
router.use('/exam-attempt', examAttempt);

export default router;
