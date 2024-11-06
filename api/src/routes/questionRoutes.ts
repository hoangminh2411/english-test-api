import express from 'express';
import * as questionController from '../controllers/questionController';

const router = express.Router();

// Get all questions for a specific exam
router.get('/exams/:examId', questionController.getQuestionsByExamId);

// Get a single question by ID
router.get('/:id', questionController.getQuestionById);

// Create a new question for a specific exam
router.post('/exams/:examId', questionController.createQuestion);

// Update an existing question by ID
router.put('/:id', questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id', questionController.deleteQuestion);

export default router;
