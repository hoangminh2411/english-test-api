import { Request, Response, NextFunction } from 'express';
import * as questionService from '../services/questionService';
import { handleResponse } from '../utils/handleResponse';

// Get all questions for a specific exam
export const getQuestionsByExamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);
    const questions = await questionService.getQuestionsByExamId(examId);
    handleResponse(res, 200, 'Questions retrieved successfully', questions);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve questions', error });
  }
};

// Get a single question by ID
export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      return next({ status: 404, message: 'Question not found' });
    }
    handleResponse(res, 200, 'Question retrieved successfully', question);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve question', error });
  }
};

// Create a new question for a specific exam
export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);
    const newQuestion = await questionService.createQuestion(examId, req.body);
    handleResponse(res, 201, 'Question created successfully', newQuestion);
  } catch (error) {
    next({ status: 500, message: 'Failed to create question', error });
  }
};

// Update an existing question by ID
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const updatedQuestion = await questionService.updateQuestion(questionId, req.body);
    if (!updatedQuestion) {
      return next({ status: 404, message: 'Question not found' });
    }
    handleResponse(res, 200, 'Question updated successfully', updatedQuestion);
  } catch (error) {
    next({ status: 500, message: 'Failed to update question', error });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const deleted = await questionService.deleteQuestion(questionId);
    if (!deleted) {
      return next({ status: 404, message: 'Question not found' });
    }
    handleResponse(res, 204, 'Question deleted successfully');
  } catch (error) {
    next({ status: 500, message: 'Failed to delete question', error });
  }
};
