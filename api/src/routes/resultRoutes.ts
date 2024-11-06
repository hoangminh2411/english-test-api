import express from 'express';
import * as resultController from '../controllers/resultController';

const router = express.Router();

// Get all results for a specific user in a specific exam
router.get('/users/:userId/exams/:examId/results', resultController.getUserResults);

// Get all results for a specific exam (admin view)
router.get('/exams/:examId/results', resultController.getExamResults);

// Get overall score for a specific user in a specific exam
router.get('/users/:userId/exams/:examId/overall-score', resultController.getOverallScore);

export default router;
