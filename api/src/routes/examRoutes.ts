import express from 'express';
import * as examController from '../controllers/examController';
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = express.Router();

// Get all exams
router.get('/',authenticateJWT, examController.getAllExams);

// Get a specific exam by ID
router.get('/:id',authenticateJWT, examController.getExamById);

// Create a new exam
router.post('/',authenticateJWT, examController.createExam);

// Update an existing exam by ID
router.put('/:id',authenticateJWT, examController.updateExam);

// Delete an exam by ID
router.delete('/:id',authenticateJWT, examController.deleteExam);

export default router;
