import express from 'express';
import * as examAttemptController from '../controllers/exam-attempt.controller';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * Get all attempts for a specific exam
 * Example: GET /exam-attempts/exams/:examId
 */
router.get('/exams/:examId', examAttemptController.getAttemptsByExamId);

/**
 * Get all attempts for a specific user
 * Example: GET /exam-attempts/users/:userId
 */
router.get('/users/:userId', examAttemptController.getAttemptsByUserId);

/**
 * Get a specific attempt by ID
 * Example: GET /exam-attempts/:attemptId
 */
router.get('/:attemptId', examAttemptController.getAttemptById);

/**
 * Create a new exam attempt
 * Example: POST /exam-attempts
 */
router.post('/',authenticateJWT, examAttemptController.createExamAttempt);

/**
 * Update an existing exam attempt by ID
 * Example: PUT /exam-attempts/:attemptId
 */
router.put('/:attemptId', examAttemptController.updateExamAttempt);

/**
 * Delete an exam attempt by ID
 * Example: DELETE /exam-attempts/:attemptId
 */
router.delete('/:attemptId', examAttemptController.deleteExamAttempt);

export default router;
