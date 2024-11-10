import db from '../models';
import { CreateQuestionAttributes, QuestionAttributes } from '../models/question'; // Import the Question attributes

// Get all questions for a specific exam
export const getQuestionsByExamId = async (examId: number): Promise<QuestionAttributes[]> => {
  return await db.Question.findAll({
    where: { examId },
    include: [
      {
        model: db.Answer,
        as: 'answers', // Include answers related to the questions if needed
      },
      {
        model: db.Document,
        as: 'document', // Include any associated documents (e.g., images)
      },
    ],
  });
};

// Get a specific question by ID
export const getQuestionById = async (id: number): Promise<QuestionAttributes | null> => {
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
};

// Create a new question for a specific exam
export const createQuestion = async (examId: number, data: CreateQuestionAttributes) => {
  const question = await db.Question.create({ ...data, examId } as any);
  return question; // Trả về instance của Question để có thể sử dụng .toJSON() sau này
};

// Update an existing question by ID
export const updateQuestion = async (
  id: number,
  questionData: Partial<QuestionAttributes>
): Promise<QuestionAttributes | null> => {
  const [updatedCount] = await db.Question.update(questionData, {
    where: { id },
  });

  // Nếu có bản ghi được cập nhật, lấy lại question từ DB
  return updatedCount > 0 ? await db.Question.findByPk(id) : null;
};

// Delete a question by ID
export const deleteQuestion = async (id: number): Promise<boolean> => {
  const deletedCount = await db.Question.destroy({
    where: { id },
  });
  return deletedCount > 0; // Return true if a record was deleted
};
