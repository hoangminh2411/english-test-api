import express from 'express';
import * as examController from '../controllers/exam.controller';
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = express.Router();

// Get all exams
router.get('/', examController.getAllExams);

// Get a specific exam by ID
router.get('/:id', examController.getExamById);

// Create a new exam
router.post('/',authenticateJWT, examController.createExam);

// Update an existing exam by ID
router.put('/:id', examController.updateExam);

// Delete an exam by ID
router.delete('/:id', examController.deleteExam);

export default router;
