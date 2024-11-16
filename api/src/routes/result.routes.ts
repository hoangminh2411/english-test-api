import express from 'express';
import * as resultController from '../controllers/result.controller';

const router = express.Router();

/**
 * Get all results for a specific exam attempt
 * Example: GET /results/attempts/:attemptId
 */
router.get('/attempts/:attemptId', resultController.getAttemptResults);

/**
 * Get overall score for a specific exam attempt
 * Example: GET /results/attempts/:attemptId/overall-score
 */
router.get('/attempts/:attemptId/overall-score', resultController.getAttemptOverallScore);

/**
 * Submit an exam for grading
 * Example: POST /results/submit
 */
router.post('/submit', resultController.submitExam);

export default router;
