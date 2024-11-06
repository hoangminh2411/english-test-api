import { Request, Response, NextFunction } from 'express';
import * as examService from '../services/examService';
import { handleResponse } from '../utils/handleResponse';

// Get a single exam by ID
export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const examDTO = await examService.findExamById(examId);
    if (!examDTO) {
      return next({ status: 404, message: 'Exam not found' });
    }
    handleResponse(res, 200, 'Exam retrieved successfully', examDTO);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve exam', error });
  }
};

// Get all exams
export const getAllExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examsDTO = await examService.getAllExams();
    handleResponse(res, 200, 'Exams retrieved successfully', examsDTO);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve exams', error });
  }
};

// Create a new exam
export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newExam = await examService.createExam(req.body);
    handleResponse(res, 201, 'Exam created successfully', newExam);
  } catch (error) {
    next({ status: 500, message: 'Failed to create exam', error });
  }
};

// Update an existing exam by ID
export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const updatedExam = await examService.updateExam(examId, req.body);
    if (!updatedExam) {
      return next({ status: 404, message: 'Exam not found' });
    }
    handleResponse(res, 200, 'Exam updated successfully', updatedExam);
  } catch (error) {
    next({ status: 500, message: 'Failed to update exam', error });
  }
};

// Delete an exam by ID
export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const deleted = await examService.deleteExam(examId);
    if (!deleted) {
      return next({ status: 404, message: 'Exam not found' });
    }
    handleResponse(res, 204, 'Exam deleted successfully');
  } catch (error) {
    next({ status: 500, message: 'Failed to delete exam', error });
  }
};
