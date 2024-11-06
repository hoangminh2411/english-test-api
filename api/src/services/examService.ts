import db from '../models';
import { toExamDTO } from '../dtos/examDTO';
import { IExam } from '../interfaces/exam';
import { RawExamData } from '../interfaces/raw-exam-data';


// Fetch a single exam by ID, including related questions and answers
export const findExamById = async (id: number): Promise<IExam | null> => {
  const examData = await db.Exam.findByPk(id, {
    include: [
      {
        model: db.Question,
        as: 'questions',
        include: [
          { model: db.Answer, as: 'answers' },
          { model: db.Document, as: 'document' },
        ],
      },
    ],
  });

  return examData ? toExamDTO(examData.get({ plain: true }) as RawExamData) : null;
};

// Fetch all exams, including related questions and answers for each exam
export const getAllExams = async (): Promise<IExam[]> => {
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
    ],
  });

  return examsData.map((exam) => toExamDTO(exam.get({ plain: true }) as RawExamData));
};

// Create a new exam
export const createExam = async (examData: Partial<IExam>): Promise<IExam> => {
  const createdExam = await db.Exam.create(examData);
  const examId = createdExam.getDataValue('id'); // Safely retrieve the id
  return findExamById(examId) as Promise<IExam>;
};

// Update an existing exam
export const updateExam = async (id: number, examData: Partial<IExam>): Promise<IExam | null> => {
  const [updated] = await db.Exam.update(examData, { where: { id } });
  return updated ? (await findExamById(id)) as IExam : null;
};

// Delete an exam by ID
export const deleteExam = async (id: number): Promise<boolean> => {
  const deleted = await db.Exam.destroy({ where: { id } });
  return !!deleted;
};
