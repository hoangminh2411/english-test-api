import db from '../models';
import { toExamDTO } from '../dtos/examDTO';
import { IExam } from '../interfaces/exam';
import { RawExamData } from '../interfaces/raw-exam-data';

export default class ExamService {
  /**
   * Fetch a single exam by ID, including related questions and answers
   */
  public async findExamById(id: number): Promise<IExam | null> {
    const examData = await db.Exam.findByPk(id, {
      include: [
        {
          model: db.Question,
          as: 'questions',
          include: [
            { model: db.Answer, as: 'answers' },
            { model: db.Document, as: 'document' },
          ],
        }
      ],
    });
    return examData ? toExamDTO(examData.get({ plain: true }) as RawExamData,true) : null;
  }

  /**
   * Fetch all exams, including related questions and answers
   */
  public async getAllExams(): Promise<IExam[]> {
    const examsData = await db.Exam.findAll({
      include: [
        {
          model: db.Question,
          as: 'questions',
          include: [
            { model: db.Answer, as: 'answers' },
            { model: db.Document, as: 'document' },
          ],
        },
        {
          model: db.ExamAttempt,
          as: 'attempts',
          attributes: ["userId"], // Exclude unnecessary details
        },
      ],
    });
    return examsData.map((exam) => toExamDTO(exam.get({ plain: true }) as RawExamData));
  }

  /**
   * Create a new exam
   */
  public async createExam(examData: Partial<IExam>): Promise<IExam> {
    const createdExam = await db.Exam.create(examData);
    const examId = createdExam.getDataValue('id');
    return this.findExamById(examId) as Promise<IExam>;
  }

  /**
   * Update an existing exam
   */
  public async updateExam(id: number, examData: Partial<IExam>): Promise<IExam | null> {
    const [updated] = await db.Exam.update(examData, { where: { id } });
    return updated > 0 ? (await this.findExamById(id)) as IExam : null;
  }

  /**
   * Delete an exam by ID
   */
  public async deleteExam(id: number): Promise<boolean> {
    const deleted = await db.Exam.destroy({ where: { id } });
    return !!deleted;
  }
}
