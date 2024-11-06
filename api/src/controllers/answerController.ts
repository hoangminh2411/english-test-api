import { Request, Response, NextFunction } from 'express';
import * as answerService from '../services/answerService';
import { handleResponse } from '../utils/handleResponse';

// Get all answers for a specific question
export const getAnswersByQuestionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.questionId);
    const answers = await answerService.getAnswersByQuestionId(questionId);
    handleResponse(res, 200, 'Answers retrieved successfully', answers);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve answers', error });
  }
};

// Create a new answer for a specific question
export const createAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.questionId);
    const newAnswer = await answerService.createAnswer(questionId, req.body);
    handleResponse(res, 201, 'Answer created successfully', newAnswer);
  } catch (error) {
    next({ status: 500, message: 'Failed to create answer', error });
  }
};

// Update an existing answer by ID
export const updateAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const answerId = Number(req.params.id);
    const updatedAnswer = await answerService.updateAnswer(answerId, req.body);
    if (!updatedAnswer) {
      return next({ status: 404, message: 'Answer not found' });
    }
    handleResponse(res, 200, 'Answer updated successfully', updatedAnswer);
  } catch (error) {
    next({ status: 500, message: 'Failed to update answer', error });
  }
};

// Delete an answer by ID
export const deleteAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const answerId = Number(req.params.id);
    const deleted = await answerService.deleteAnswer(answerId);
    if (!deleted) {
      return next({ status: 404, message: 'Answer not found' });
    }
    handleResponse(res, 204, 'Answer deleted successfully');
  } catch (error) {
    next({ status: 500, message: 'Failed to delete answer', error });
  }
};
