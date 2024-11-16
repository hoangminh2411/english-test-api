import db from '../models';
import { CreateResultAttributes } from '../models/result';
import { IExamSubmission } from '../interfaces/exam-submission';

import { QuestionType } from '../interfaces/question';
import GradingService from './grading.service';
import { AssemblyAI } from 'assemblyai';
import { SkillScores } from '../interfaces/results';
import ExamAttemptService from './exam-attempt.service';

const client = new AssemblyAI({
  apiKey: process.env.A_API_KEY || '',
});

export default class ResultService {
  private gradingService: GradingService;
  private examAttemptService: ExamAttemptService;
  constructor() {
    this.gradingService = new GradingService();
    this.examAttemptService = new ExamAttemptService();
  }
  /**
   * Create a new result record linked to an exam attempt
   */
  public async createResult(
    attemptId: number,
    data: Omit<CreateResultAttributes, 'examId' | 'userId'>
  ): Promise<any> {
    return await db.Result.create({
      ...data, attemptId,
     
    } as any);
  }

  /**
   * Retrieve a result by ID
   */
  public async findResultById(id: number): Promise<any | null> {
    return await db.Result.findByPk(id, {
      include: [
        {
          model: db.Question,
          as: 'question',
          attributes: ['content', 'type'],
        },
      ],
    });
  }

  /**
   * Update a result by ID
   */
  public async updateResult(id: number, data: Partial<CreateResultAttributes>): Promise<any | null> {
    const [updated] = await db.Result.update(data, { where: { id } });
    return updated ? this.findResultById(id) : null;
  }

  /**
   * Delete a result by ID
   */
  public async deleteResult(id: number): Promise<boolean> {
    const deleted = await db.Result.destroy({ where: { id } });
    return !!deleted;
  }

  /**
   * Process an exam submission and calculate skill scores
   */
  public async processSubmission(
    submissionData: IExamSubmission,
    attemptId: number
  ): Promise<{ success: boolean; scores: SkillScores }> {
    const { answers } = submissionData;

    const questionCounts: SkillScores = { listening: 35, reading: 40, speaking: 3, writing: 2 };
    const rawScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };

    const transaction = await db.sequelize.transaction();
    try {
      const questionIds = answers.map((answer) => answer.questionId);
      const questions = await db.Question.findAll({ where: { id: questionIds }, transaction });
      const questionsMap = new Map(questions.map((q) => [q.id, q]));

      await Promise.all(
        answers.map(async (answer) => {
          const question = questionsMap.get(answer.questionId);
          if (!question) throw new Error(`Question ID ${answer.questionId} not found`);

          const questionData = question.get({ plain: true });

          if (questionData.type === 'LISTENING' || questionData.type === 'READING') {
            const isCorrect = await this.handleMultipleChoiceAnswer(attemptId, answer, transaction);
            if (isCorrect) {
              questionData.type === 'LISTENING' ? rawScores.listening++ : rawScores.reading++;
            }
          } else if (questionData.type === 'WRITING' || questionData.type === 'SPEAKING') {
            const freeTextScore = await this.handleFreeTextAnswer(
              attemptId,
              answer,
              questionData.content,
              transaction,
              questionData.type
            );
            questionData.type === 'SPEAKING' ? (rawScores.speaking += freeTextScore) : (rawScores.writing += freeTextScore);
          }
        })
      );

      const finalScores: SkillScores = this.calculateSkillScores(rawScores, questionCounts);
      await this.examAttemptService.updateExamAttempt(attemptId, {
        status: 'completed',
        scores: finalScores,
      }, transaction);
      await transaction.commit();
      return { success: true, scores: finalScores };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Helper to handle multiple-choice answers
   */
  private async handleMultipleChoiceAnswer(
    attemptId: number,
    answer: { questionId: number; selectedAnswer: string },
    transaction: any
  ): Promise<boolean> {
    const correctAnswer = await db.Answer.findOne({
      where: { questionId: answer.questionId, isCorrect: true },
      transaction,
    });

    if (!correctAnswer) throw new Error(`Correct Answer not found for Question ID ${answer.questionId}`);

    const isCorrect = correctAnswer.content === answer.selectedAnswer;
    const score = isCorrect ? 1 : 0;

    await this.createResult(attemptId, {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
      score,
    } as any);

    return isCorrect;
  }

  /**
   * Helper to handle free-text answers
   */
  private async handleFreeTextAnswer(
    attemptId: number,
    answer: { questionId: number; selectedAnswer: string },
    questionContent: string,
    transaction: any,
    questionType: QuestionType
  ): Promise<number> {
    let answerContent = answer.selectedAnswer;

    if (questionType === 'SPEAKING') {
      const transcript = await client.transcripts.transcribe({ audio_url: answer.selectedAnswer });
      answerContent = transcript?.text || '';
    }

    const grading = await this.gradingService.gradeFreeTextAnswer(questionContent, answerContent);
    await this.createResult(attemptId, {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: false,
      score: grading.score,
      feedback: grading.feedback,
    } as any);

    return grading.score;
  }

  /**
   * Helper to calculate skill scores
   */
  private calculateSkillScores(rawScores: SkillScores, questionCounts: SkillScores): SkillScores {
    const finalScores: SkillScores = {
      listening: (rawScores.listening / questionCounts.listening) * 9,
      reading: (rawScores.reading / questionCounts.reading) * 9,
      speaking: rawScores.speaking / questionCounts.speaking,
      writing: rawScores.writing / questionCounts.writing,
    };

    for (const skill in finalScores) {
      finalScores[skill as keyof SkillScores] = parseFloat(finalScores[skill as keyof SkillScores].toFixed(1));
    }

    return finalScores;
  }

  /**
   * Retrieve all results for a specific attempt
   */
  public async getResultsByAttempt(attemptId: number): Promise<any[]> {
    return await db.Result.findAll({
      where: { attemptId },
      include: [
        {
          model: db.Question,
          as: 'question',
          attributes: ['content', 'type'],
        },
      ],
    });
  }

  /**
   * Retrieve all results for a specific exam
   */
  public async getExamResults(examId: number): Promise<any[]> {
    return await db.Result.findAll({
      include: [
        {
          model: db.ExamAttempt,
          as: 'attempt',
          where: { examId },
        },
        {
          model: db.Question,
          as: 'question',
          attributes: ['content', 'type'],
        },
        {
          model: db.User,
          as: 'candidate',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  public async getOverallScoreByAttempt(attemptId: number): Promise<SkillScores> {
    const results = await db.Result.findAll({
      where: { attemptId },
      include: [{ model: db.Question, as: 'question', attributes: ['type'] }],
    });
  
    // Calculate scores based on results
    const questionCounts: SkillScores = { listening: 35, reading: 40, speaking: 3, writing: 2 };
    const rawScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };
  
    results.forEach((result: any) => {
      const questionType = result.question?.type;
      const resultScore = result.score || 0;
  
      if (questionType === 'LISTENING' && resultScore === 1) rawScores.listening++;
      else if (questionType === 'READING' && resultScore === 1) rawScores.reading++;
      else if (questionType === 'SPEAKING') rawScores.speaking += resultScore;
      else if (questionType === 'WRITING') rawScores.writing += resultScore;
    });
  
    return this.calculateSkillScores(rawScores, questionCounts);
  }

}
