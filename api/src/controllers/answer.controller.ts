import { Request, Response, NextFunction } from 'express';
import AnswerService from '../services/answer.service';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

const answerService = new AnswerService();

/**
 * Get all answers for a specific question
 */
export const getAnswersByQuestionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.questionId);

    if (isNaN(questionId)) {
      return handleError(res, new Error('Invalid questionId'));
    }

    const answers = await answerService.getAnswersByQuestionId(questionId);

    handleResponse(res, 200, 'Answers retrieved successfully', answers);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Create a new answer for a specific question
 */
export const createAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.questionId);

    if (isNaN(questionId)) {
      return handleError(res, new Error('Invalid questionId'));
    }

    const { content, isCorrect } = req.body;

    if (!content) {
      return handleError(res, new Error('Content is required'));
    }

    const newAnswer = await answerService.createAnswer(questionId, {
      content,
      isCorrect: !!isCorrect, // Ensure a boolean value
    }as any);

    handleResponse(res, 201, 'Answer created successfully', newAnswer);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Update an existing answer by ID
 */
export const updateAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const answerId = Number(req.params.id);

    if (isNaN(answerId)) {
      return handleError(res, new Error('Invalid answerId'));
    }

    const { content, isCorrect } = req.body;

    if (!content && isCorrect === undefined) {
      return handleError(res, new Error('Content or isCorrect is required'));
    }

    const updatedAnswer = await answerService.updateAnswer(answerId, {
      content,
      isCorrect,
    });

    if (!updatedAnswer) {
      return handleError(res, new Error('Answer not found'));
    }

    handleResponse(res, 200, 'Answer updated successfully', updatedAnswer);
  } catch (error) {
    handleError(res,error);
  }
};

/**
 * Delete an answer by ID
 */
export const deleteAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const answerId = Number(req.params.id);

    if (isNaN(answerId)) {
      return handleError(res, new Error('Invalid answerId'));
    }
     

    const deleted = await answerService.deleteAnswer(answerId);

    if (!deleted) {
      return handleError(res, new Error('Answer not found'));
    }

    handleResponse(res, 204, 'Answer deleted successfully');
  } catch (error) {
    handleError(res,error);
  }
};
