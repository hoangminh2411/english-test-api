import { Request, Response, NextFunction } from 'express';
import * as resultService from '../services/resultService';
import { handleResponse } from '../utils/handleResponse';

// Get all results for a specific user in a specific exam
export const getUserResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    const examId = Number(req.params.examId);
    const userResults = await resultService.getUserResultsByExam(userId, examId);
    handleResponse(res, 200, 'User results retrieved successfully', userResults);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve user results', error });
  }
};

// Get all results for a specific exam (admin view)
export const getExamResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);
    const examResults = await resultService.getExamResults(examId);
    handleResponse(res, 200, 'Exam results retrieved successfully', examResults);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve exam results', error });
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
    next({ status: 500, message: 'Failed to retrieve overall score', error });
  }
};
