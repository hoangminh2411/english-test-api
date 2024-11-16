import express from 'express';
import * as answerController from '../controllers/answer.controller';

const router = express.Router();

// Get all answers for a specific question
router.get('/questions/:questionId', answerController.getAnswersByQuestionId);

// Create a new answer for a specific question
router.post('/questions/:questionId', answerController.createAnswer);

// Update an existing answer by ID
router.put('/:id', answerController.updateAnswer);

// Delete an answer by ID
router.delete('/:id', answerController.deleteAnswer);

export default router;
