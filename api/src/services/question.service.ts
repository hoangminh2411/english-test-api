import db from '../models';
import { CreateQuestionAttributes, QuestionAttributes } from '../models/question';
import DocumentService from './document.service';
import AnswerService from './answer.service';

export default class QuestionService {
  private documentService: DocumentService;
  private answerService: AnswerService;

  constructor() {
    this.documentService = new DocumentService();
    this.answerService = new AnswerService();
  }

  /**
   * Get all questions for a specific exam
   */
  public async getQuestionsByExamId(examId: number): Promise<QuestionAttributes[]> {
    return await db.Question.findAll({
      where: { examId },
      include: [
        {
          model: db.Answer,
          as: 'answers',
        },
        {
          model: db.Document,
          as: 'document',
        },
      ],
    });
  }


  /**
   * Get a specific question by ID
   */
  public async getQuestionById(id: number): Promise<QuestionAttributes | null> {
    return await db.Question.findByPk(id, {
      include: [
        {
          model: db.Answer,
          as: 'answers',
        },
        {
          model: db.Document,
          as: 'document',
        },
      ],
    });
  }

  /**
   * Create a new question for a specific exam
   */
  public async createQuestion(examId: number, data: CreateQuestionAttributes): Promise<QuestionAttributes> {
    const question = await db.Question.create({ ...data, examId } as any);
    return question;
  }

  /**
   * Update an existing question by ID
   */
  public async updateQuestion(id: number, questionData: Partial<QuestionAttributes>): Promise<QuestionAttributes | null> {
    const [updatedCount] = await db.Question.update(questionData, {
      where: { id },
    });

    return updatedCount > 0 ? await this.getQuestionById(id) : null;
  }

  /**
   * Import multiple questions for an exam
   */
  public async importQuestions(examId: number, questions: any[]): Promise<any[]> {
    if (!examId || !questions || !Array.isArray(questions)) {
      throw new Error('Invalid input format');
    }

    const createdQuestions = [];

    for (const questionData of questions) {
      const { content, type, answers, document, parentId } = questionData;

      // Determine the next order value based on existing questions for this exam
      const existingQuestions = await this.getQuestionsByExamId(examId);
      const newOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) + 1 : 1;

      // Step 1: Create the new question without documentId
      const newQuestion = await this.createQuestion(examId, {
        content,
        type,
        parentId,
        order: newOrder,
      } as any);

      // Step 2: Handle document association
      let documentRecord = null;
      if (document) {
        documentRecord = await this.documentService.findDocumentByUrl(document.url);

        // If the document does not exist, create it
        if (!documentRecord) {
          documentRecord = await this.documentService.createDocument({
            url: document.url,
            type: document.type,
            questionId: newQuestion.id,
          });
        } else {
          // Update the existing document with questionId if not already set
          await this.documentService.updateDocument(documentRecord.id, { questionId: newQuestion.id });
        }

        // Update the question with the associated documentId
        await this.updateQuestion(newQuestion.id, { documentId: documentRecord.id });
      }

      // Step 3: Handle answers
      const createdAnswers = [];
      if (answers && Array.isArray(answers)) {
        for (const answerData of answers) {
          const answer = await this.answerService.createAnswer(newQuestion.id, {
            content: answerData.text,
            isCorrect: answerData.isCorrect,
          } as any);
          createdAnswers.push(answer);
        }
      }

      // Add the question along with its answers and document to the created questions array
      createdQuestions.push({ ...newQuestion.toJSON(), answers: createdAnswers, document: documentRecord });
    }

    return createdQuestions;
  }


   /**
   * Delete a Question by ID
   */
   public async deleteQuestion(id: number): Promise<boolean> {
    const deletedCount = await db.Question.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
