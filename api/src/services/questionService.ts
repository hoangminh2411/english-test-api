import db from '../models';
import { QuestionAttributes } from '../models/question'; // Import the Question attributes

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
export const createQuestion = async (examId: number, questionData: QuestionAttributes): Promise<QuestionAttributes> => {
  const newQuestion = await db.Question.create({
    ...questionData,
    examId, // Set the examId for the new question
  });
  return newQuestion;
};

// Update an existing question by ID
export const updateQuestion = async (id: number, questionData: Partial<QuestionAttributes>): Promise<QuestionAttributes | null> => {
  const [updatedCount, [updatedQuestion]] = await db.Question.update(questionData, {
    where: { id },
    returning: true, // Return the updated question
  });

  return updatedCount > 0 ? updatedQuestion : null;
};

// Delete a question by ID
export const deleteQuestion = async (id: number): Promise<boolean> => {
  const deletedCount = await db.Question.destroy({
    where: { id },
  });
  return deletedCount > 0; // Return true if a record was deleted
};
