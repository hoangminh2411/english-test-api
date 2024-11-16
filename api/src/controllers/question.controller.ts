import { Request, Response, NextFunction } from 'express';
import QuestionService from '../services/question.service';
import DocumentService from '../services/document.service';
import AnswerService from '../services/answer.service';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

const questionService = new QuestionService();
const documentService = new DocumentService();
const answerService = new AnswerService();

/**
 * Get all questions for a specific exam
 */
export const getQuestionsByExamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examId = Number(req.params.examId);

    if (isNaN(examId)) {
      return next({ status: 400, message: 'Invalid examId' });
    }

    const questions = await questionService.getQuestionsByExamId(examId);
    handleResponse(res, 200, 'Questions retrieved successfully', questions);
  } catch (error) {
    next({ status: 500, message: 'Failed to retrieve questions', error });
  }
};

/**
 * Get a single question by ID
 */
export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);

    if (isNaN(questionId)) {
      return handleError(res, new Error('Invalid questionId'));
    }

    const question = await questionService.getQuestionById(questionId);

    if (!question) {
      return handleError(res, new Error('Question not found'));
    }

    handleResponse(res, 200, 'Question retrieved successfully', question);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Create a new question for a specific exam
 */
export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { document, content, type, answers, parentId } = req.body;
    const examId = Number(req.params.examId);

    if (isNaN(examId)) {
      return handleError(res, new Error('Invalid examId'));
    }

    // Determine the next order value
    const existingQuestions = await questionService.getQuestionsByExamId(examId);
    const newOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) + 1 : 1;

    // Step 1: Create the question
    const newQuestion = await questionService.createQuestion(examId, {
      content,
      type,
      parentId,
      order: newOrder,
    });

    // Step 2: Handle document
    if (document) {
      let documentRecord = await documentService.findDocumentByUrl(document.url);

      if (!documentRecord) {
        documentRecord = await documentService.createDocument({
          url: document.url,
          type: document.type,
          questionId: newQuestion.id,
        });
      } else {
        await documentService.updateDocument(documentRecord.id, { questionId: newQuestion.id });
      }

      await questionService.updateQuestion(newQuestion.id, { documentId: documentRecord.id });
    }

    // Step 3: Handle answers
    if (answers && Array.isArray(answers)) {
      for (const answerData of answers) {
        await answerService.createAnswer(newQuestion.id, {
          content: answerData.text,
          isCorrect: answerData.isCorrect,
        } as any);
      }
    }

    handleResponse(res, 201, 'Question created successfully', newQuestion);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Update an existing question by ID
 */
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);

    if (isNaN(questionId)) {
      return handleError(res, new Error('Invalid questionId'));
    }

    const updatedQuestion = await questionService.updateQuestion(questionId, req.body);

    if (!updatedQuestion) {
      return handleError(res, new Error('Question not found'));
    }

    handleResponse(res, 200, 'Question updated successfully', updatedQuestion);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Delete a question by ID
 */
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Number(req.params.id);

    if (isNaN(questionId)) {
      return handleError(res, new Error('Invalid questionId'));
    }

    const deleted = await questionService.deleteQuestion(questionId);

    if (!deleted) {
      return handleError(res, new Error('Question not found'));
    }

    handleResponse(res, 200, 'Question deleted successfully');
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Import multiple questions into an exam
 */
export const importQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questions } = req.body;
    const examId = Number(req.params.examId);

    if (!examId || !questions || !Array.isArray(questions)) {
      return handleError(res, new Error('Invalid input format'));
    }

    const createdQuestions = await Promise.all(
      questions.map(async (questionData: any) => {
        const { content, type, answers, document, parentId } = questionData;

        // Determine the next order value
        const existingQuestions = await questionService.getQuestionsByExamId(examId);
        const newOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) + 1 : 1;

        // Create the question
        const newQuestion = await questionService.createQuestion(examId, {
          content,
          type,
          parentId,
          order: newOrder,
        });

        // Handle document
        let documentRecord = null;
        if (document) {
          documentRecord = await documentService.findDocumentByUrl(document.url);

          if (!documentRecord) {
            documentRecord = await documentService.createDocument({
              url: document.url,
              type: document.type,
              questionId: newQuestion.id,
            });
          } else {
            await documentService.updateDocument(documentRecord.id, { questionId: newQuestion.id });
          }

          await questionService.updateQuestion(newQuestion.id, { documentId: documentRecord.id });
        }

        // Handle answers
        const createdAnswers = [];
        if (answers && Array.isArray(answers)) {
          for (const answerData of answers) {
            const answer = await answerService.createAnswer(newQuestion.id, {
              content: answerData.text,
              isCorrect: answerData.isCorrect,
            } as any);
            createdAnswers.push(answer);
          }
        }

        return { ...newQuestion.toJSON(), answers: createdAnswers, document: documentRecord };
      })
    );

    handleResponse(res, 201, 'Questions imported successfully', createdQuestions);
  } catch (error) {
    handleError(res, error)
  }
};
