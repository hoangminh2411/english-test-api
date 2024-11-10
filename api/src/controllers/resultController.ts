import { Request, Response, NextFunction } from 'express';
import * as resultService from '../services/resultService';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

// Get all results for a specific user in a specific exam
export const getUserResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    const examId = Number(req.params.examId);
    const userResults = await resultService.getUserResultsByExam(userId, examId);
    handleResponse(res, 200, 'User results retrieved successfully', userResults);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Get all results for a specific exam (admin view)
export const getExamResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);
    const examResults = await resultService.getExamResults(examId);
    handleResponse(res, 200, 'Exam results retrieved successfully', examResults);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Get overall score for a specific user in a specific exam
export const getOverallScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    const examId = Number(req.params.examId);
    const scoreData = await resultService.getOverallScoreBySkill(userId, examId);
    handleResponse(res, 200, 'Overall score retrieved successfully', scoreData);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};


// Submit exam for grading and saving results
export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissionData = req.body;
    const result = await resultService.processSubmission(submissionData);
    handleResponse(res, 200, 'Exam submitted and processed successfully', result.scores);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};
