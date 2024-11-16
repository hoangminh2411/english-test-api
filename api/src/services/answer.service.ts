import db from '../models';
import { AnswerAttributes } from '../models/answer';

export default class AnswerService {
  /**
   * Get all answers for a specific question
   */
  public async getAnswersByQuestionId(questionId: number): Promise<AnswerAttributes[]> {
    return await db.Answer.findAll({
      where: { questionId },
    });
  }

  /**
   * Create a new answer for a specific question
   */
  public async createAnswer(questionId: number, answerData: Omit<AnswerAttributes, 'id'>): Promise<AnswerAttributes> {
    const newAnswer = await db.Answer.create({
      ...answerData,
      questionId,
    } as any);

    return newAnswer.toJSON(); // Return the newly created answer as a plain object
  }

  /**
   * Update an existing answer by ID
   */
  public async updateAnswer(id: number, answerData: Partial<AnswerAttributes>): Promise<AnswerAttributes | null> {
    const [updatedCount, [updatedAnswer]] = await db.Answer.update(answerData, {
      where: { id },
      returning: true, // Return the updated answer
    });

    return updatedCount > 0 ? updatedAnswer : null;
  }

  /**
   * Delete an answer by ID
   */
  public async deleteAnswer(id: number): Promise<boolean> {
    const deletedCount = await db.Answer.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }
}
