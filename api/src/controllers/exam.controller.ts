import { Request, Response, NextFunction } from 'express';
import ExamService from '../services/exam.service';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

const examService = new ExamService();

/**
 * Get a single exam by ID
 */
export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);

    if (isNaN(examId)) {
      return handleError(res, new Error('Invalid examId'));
    }

    const examDTO = await examService.findExamById(examId);

    if (!examDTO) {
      return handleError(res, new Error('Exam not found'));
    }

    handleResponse(res, 200, 'Exam retrieved successfully', examDTO);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Get all exams
 */
export const getAllExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examsDTO = await examService.getAllExams();
    handleResponse(res, 200, 'Exams retrieved successfully', examsDTO);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Create a new exam
 */
export const createExam = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Extract the user ID from the request (from authentication middleware)
    const createdBy = req.user?.id;

    if (!createdBy) {
      return handleError(res, new Error('Missing creator information'));
    }

    const newExam = await examService.createExam({
      ...req.body,
      createdBy,
    });

    handleResponse(res, 201, 'Exam created successfully', newExam);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Update an existing exam by ID
 */
export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);

    if (isNaN(examId)) {
      return handleError(res, new Error('Invalid examId'));
    }

    const updatedExam = await examService.updateExam(examId, req.body);

    if (!updatedExam) {
      return handleError(res, new Error('Exam not found'));
    }

    handleResponse(res, 200, 'Exam updated successfully', updatedExam);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Delete an exam by ID
 */
export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);

    if (isNaN(examId)) {
      return handleError(res, new Error('Invalid examId'));
    }

    const deleted = await examService.deleteExam(examId);

    if (!deleted) {
      return handleError(res, new Error('Exam not found'));
    }

    handleResponse(res, 200, 'Exam deleted successfully');
  } catch (error) {
    handleError(res, error)
  }
};
