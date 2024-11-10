import { Request, Response, NextFunction } from 'express';
import * as questionService from '../services/questionService';
import * as documentService from '../services/documentService';
import * as answerService from '../services/answerService';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

// Get all questions for a specific exam
export const getQuestionsByExamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);
    const questions = await questionService.getQuestionsByExamId(examId);
    handleResponse(res, 200, 'Questions retrieved successfully', questions);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Get a single question by ID
export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      return handleError(res, new Error('Question not found'));
    }
    handleResponse(res, 200, 'Question retrieved successfully', question);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { document,content,type, answers, parentId } = req.body;
    const examId = Number(req.params.examId);

    // Determine the next order value based on existing questions for this exam
    const existingQuestions = await questionService.getQuestionsByExamId(examId);
    const newOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) + 1 : 1;

    // Step 1: Create the new question without documentId
    const newQuestion = await questionService.createQuestion(examId, {
        content,
        type,
        parentId,
        order: newOrder,
    }as any);


    if(document) {  
      // Step 2: Check if the document exists
      let documentRecord = await documentService.findDocumentByUrl(document.url);
      // If the document does not exist, create it with questionId
      if (!documentRecord) {
        documentRecord = await documentService.createDocument({
          url: document.url,
          type: document.type,
          questionId: newQuestion.id  // Associate questionId with the document
        });
      } else {
        // Update the existing document with questionId if not already set
        await documentService.updateDocument(documentRecord.id, { questionId: newQuestion.id });
      }

      // Update the question with the associated documentId
      await questionService.updateQuestion(newQuestion.id, { documentId: documentRecord.id });
    }

    // Step 3: Create answers for the question
    if (answers && Array.isArray(answers)) {
      for (const answerData of answers) {
        const answer = await answerService.createAnswer(newQuestion.id,{
          content: answerData.text,
          isCorrect: answerData.isCorrect
        } as any);
      }
    }

    // Respond with the created question and associated document
    handleResponse(res, 201, 'Question created successfully', newQuestion);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Update an existing question by ID
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const updatedQuestion = await questionService.updateQuestion(questionId, req.body);
    if (!updatedQuestion) {
      return handleError(res, new Error('Question not found'));
    }
    handleResponse(res, 200, 'Question updated successfully', updatedQuestion);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Delete a question by ID
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);
    const deleted = await questionService.deleteQuestion(questionId);
    if (!deleted) {
      return handleError(res, new Error('Question not found'));
    }
    handleResponse(res, 200, 'Question deleted successfully');
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};


//Import Questions
export const importQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questions } = req.body;
    const examId = Number(req.params.examId);
    if (!examId || !questions || !Array.isArray(questions)) {
      return handleResponse(res, 400, 'Invalid input format');
    }

    const createdQuestions = [];

    for (const questionData of questions) {
      const { content, type, answers, document, parentId } = questionData;

      // Determine the next order value based on existing questions for this exam
      const existingQuestions = await questionService.getQuestionsByExamId(examId);
      const newOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) + 1 : 1;

      // Step 1: Create the new question without documentId
      const newQuestion = await questionService.createQuestion(examId, {
        content,
        type,
        parentId,
        order: newOrder,
      }as any);

      // Step 2: Check if the document exists and associate with the question
      let documentRecord = null;
      if (document) {
        documentRecord = await documentService.findDocumentByUrl(document.url);

        // If the document does not exist, create it with questionId
        if (!documentRecord) {
          documentRecord = await documentService.createDocument({
            url: document.url,
            type: document.type,
            questionId: newQuestion.id
          });
        } else {
          // Update the existing document with questionId if not already set
          await documentService.updateDocument(documentRecord.id, { questionId: newQuestion.id });
        }

        // Update the question with the associated documentId
        await questionService.updateQuestion(newQuestion.id, { documentId: documentRecord.id });
      }

      // Step 3: Create answers for the question
      const createdAnswers = [];
      if (answers && Array.isArray(answers)) {
        for (const answerData of answers) {
          const answer = await answerService.createAnswer(newQuestion.id,{
            content: answerData.text,
            isCorrect: answerData.isCorrect
          } as any);
          createdAnswers.push(answer);
        }
      }

      // Add the question along with its answers and document to the created questions array
      createdQuestions.push({ ...newQuestion.toJSON(), answers: createdAnswers, document: documentRecord });
    }

    handleResponse(res, 201, 'Questions imported successfully', createdQuestions);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};