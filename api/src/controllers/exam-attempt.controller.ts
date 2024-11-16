import { Request, Response, NextFunction } from 'express';

import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';
import ExamAttemptService from '../services/exam-attempt.service';

const examAttemptService = new ExamAttemptService();
/**
 * Get all attempts for a specific exam
 */
export const getAttemptsByExamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);

    if (isNaN(examId)) {
      return handleError(res, new Error('Invalid examId'));
    }

    const attempts = await examAttemptService.getAttemptsByExamId(examId);
    handleResponse(res, 200, 'Exam attempts retrieved successfully', attempts);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Get all attempts for a specific user
 */
export const getAttemptsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return handleError(res, new Error('Invalid userId'));
    }

    const attempts = await examAttemptService.getAttemptsByUserId(userId);
    handleResponse(res, 200, 'User attempts retrieved successfully', attempts);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Get a specific attempt by ID
 */
export const getAttemptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (isNaN(attemptId)) {
      return handleError(res, new Error('Invalid attemptId'));
    }

    const attempt = await examAttemptService.getAttemptById(attemptId);

    if (!attempt) {
      return handleError(res, new Error('Attempt not found'));
    }

    handleResponse(res, 200, 'Exam attempt retrieved successfully', attempt);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Create a new exam attempt
 */
export const createExamAttempt = async (req: any, res: Response, next: NextFunction) => {
  try {

    const userId = req.user?.id; // `req.user` is set by the authentication middleware

    if (!userId) {
      return handleError(res, new Error('User is not authenticated'));
    }
    const {  examId } = req.body;

    if (!userId || !examId) {
      return handleError(res, new Error('userId and examId are required'));
    }

    

    const newAttempt = await examAttemptService.createExamAttempt({ userId, examId });
    handleResponse(res, 201, 'Exam attempt created successfully', newAttempt);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Update an existing exam attempt by ID
 */
export const updateExamAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (isNaN(attemptId)) {
      return handleError(res, new Error('Invalid attemptId'));
    }

    const updatedAttempt = await examAttemptService.updateExamAttempt(attemptId, req.body);

    if (!updatedAttempt) {
      return handleError(res, new Error('Exam attempt not found'));
    }

    handleResponse(res, 200, 'Exam attempt updated successfully', updatedAttempt);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Delete an exam attempt by ID
 */
export const deleteExamAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (isNaN(attemptId)) {
      return handleError(res, new Error('Invalid attemptId'));
    }

    const deleted = await examAttemptService.deleteExamAttempt(attemptId);

    if (!deleted) {
      return handleError(res, new Error('Exam attempt not found'));
    }

    handleResponse(res, 204, 'Exam attempt deleted successfully');
  } catch (error) {
    handleError(res, error)
  }
};
