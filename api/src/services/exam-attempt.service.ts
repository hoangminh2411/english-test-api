import db from '../models';
import { ExamAttemptAttributes } from '../models/exam-attempt';


export default class ExamAttemptService {
  /**
   * Get all attempts for a specific exam
   */
  public async getAttemptsByExamId(examId: number): Promise<ExamAttemptAttributes[]> {
    return await db.ExamAttempt.findAll({
      where: { examId },
      include: [
        {
          model: db.User,
          as: 'candidate', // Use the alias defined in the association
          attributes: ['id', 'username'], // Include user details
        },
      ],
    });
  }

  /**
   * Get all attempts for a specific user
   */
  public async getAttemptsByUserId(userId: number): Promise<ExamAttemptAttributes[]> {
    return await db.ExamAttempt.findAll({
      where: { userId },
      include: [
        {
          model: db.Exam,
          as: 'exam',
          attributes: ['id', 'name', 'totalTime'], // Include exam details
        },
      ],
    });
  }

  /**
   * Get a specific attempt by ID
   */
  public async getAttemptById(attemptId: number): Promise<ExamAttemptAttributes | null> {
    return await db.ExamAttempt.findByPk(attemptId, {
      include: [
        {
          model: db.User,
          as: 'candidate', // Use the correct alias here
          attributes: ['id', 'username'], // Include user details
        },
        {
          model: db.Exam,
          as: 'exam',
          attributes: ['id', 'name', 'totalTime'], // Include exam details
        },
      ],
    });
  }

  /**
   * Create a new exam attempt
   */
  public async createExamAttempt(data: { userId: number; examId: number }): Promise<ExamAttemptAttributes> {
    const existingAttempt = await this.getInProgressAttempt(data.userId, data.examId);
    if (existingAttempt) {
      return  existingAttempt
    }
    return await db.ExamAttempt.create(data as any);
  }

  /**
   * Update an existing exam attempt by ID
   */
  public async updateExamAttempt(
    attemptId: number,
    data: any,
    transaction?: any
  ): Promise<any> {
    return await db.ExamAttempt.update(data, { where: { id: attemptId }, transaction:transaction });
  }
  /**
   * Delete a specific exam attempt by ID
   */
  public async deleteExamAttempt(attemptId: number): Promise<boolean> {
    const deletedCount = await db.ExamAttempt.destroy({
      where: { id: attemptId },
    });

    return deletedCount > 0;
  }

  /**
 * Get an in-progress attempt for a specific user and exam
 */
  public async getInProgressAttempt(userId: number, examId: number): Promise<ExamAttemptAttributes | null> {
    return await db.ExamAttempt.findOne({
      where: {
        userId,
        examId,
        status: 'in_progress', // Check for attempts with status 'in_progress'
      },
    });
  }
}
