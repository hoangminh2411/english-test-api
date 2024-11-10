import { Request, Response, NextFunction } from 'express';
import * as examService from '../services/examService';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

// Get a single exam by ID
export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const examDTO = await examService.findExamById(examId);
    if (!examDTO) {
      return handleError(res, new Error('Exam not found'));
    }
    handleResponse(res, 200, 'Exam retrieved successfully', examDTO);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Get all exams
export const getAllExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examsDTO = await examService.getAllExams();
    handleResponse(res, 200, 'Exams retrieved successfully', examsDTO);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Create a new exam
export const createExam = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Extract the user ID from the request (from the token)
    const createdBy = req.user?.id; // This assumes you have set req.user in the auth middleware

    if (!createdBy) {
      return handleResponse(res, 400, 'Missing creator information', null);
    }

    // Create a new exam, including createdBy from the authenticated user
    const newExam = await examService.createExam({ ...req.body, createdBy }); // Set createdBy from the authenticated user
    handleResponse(res, 201, 'Exam created successfully', newExam);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Update an existing exam by ID
export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const updatedExam = await examService.updateExam(examId, req.body);
    if (!updatedExam) {
      return handleError(res, new Error('Exam not found'));
    }
    handleResponse(res, 200, 'Exam updated successfully', updatedExam);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Delete an exam by ID
export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.id);
    const deleted = await examService.deleteExam(examId);
    if (!deleted) {
      // Instead of using next, directly call handleError for 404
      return handleError(res, new Error('Exam not found'));
    }
     // Use 200 status and provide a message indicating successful deletion
     handleResponse(res, 200, 'Exam deleted successfully');
  } catch (error) {
    console.error("ERROR", error)
    handleError(res, error); // Use the common error handler
  }
};
