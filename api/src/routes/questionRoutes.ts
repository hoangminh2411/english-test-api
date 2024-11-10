import express from 'express';
import * as questionController from '../controllers/questionController';
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = express.Router();

// Get all questions for a specific exam
router.get('/exams/:examId',authenticateJWT, questionController.getQuestionsByExamId);

// Get a single question by ID
router.get('/:id',authenticateJWT,  questionController.getQuestionById);

// Create a new question for a specific exam
router.post('/exams/:examId',authenticateJWT,  questionController.createQuestion);

// Update an existing question by ID
router.put('/:id',authenticateJWT,  questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id',authenticateJWT,  questionController.deleteQuestion);


// Import multiple questions for a specific exam
router.post('/exams/:examId/import', authenticateJWT, questionController.importQuestions);

export default router;
