import { Request, Response, NextFunction } from 'express';
import ResultService from '../services/result.service';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

const resultService = new ResultService();

/**
 * Get all results for a specific exam attempt
 */
export const getAttemptResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (isNaN(attemptId)) {
      return handleError(res, new Error('Invalid attemptId'));
    }

    const attemptResults = await resultService.getResultsByAttempt(attemptId);
    handleResponse(res, 200, 'Results for the attempt retrieved successfully', attemptResults);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Get overall score for a specific exam attempt
 */
export const getAttemptOverallScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (isNaN(attemptId)) {
      return handleError(res, new Error('Invalid attemptId'));
    }

    const overallScore = await resultService.getOverallScoreByAttempt(attemptId);
    handleResponse(res, 200, 'Overall score for the attempt retrieved successfully', overallScore);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Submit exam for grading and saving results
 */
export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attemptId, submissionData } = req.body;

    if (!attemptId || !submissionData) {
      return handleError(res, new Error('AttemptId and submissionData are required'));
    }

    const result = await resultService.processSubmission(submissionData, attemptId);
    handleResponse(res, 200, 'Exam submitted and processed successfully', result.scores);
  } catch (error) {
    handleError(res, error)
  }
};
