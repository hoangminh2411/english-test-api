import db from '../models';
import { AnswerAttributes } from '../models/answer';


// Get all answers for a specific question
export const getAnswersByQuestionId = async (questionId: number): Promise<AnswerAttributes[]> => {
  return await db.Answer.findAll({
    where: { questionId },
  });
};

// Create a new answer for a specific question
export const createAnswer = async (questionId: number, answerData:AnswerAttributes): Promise<AnswerAttributes> => {
  // Create a new answer in the database
  const newAnswer = await db.Answer.create({
    ...answerData, // Spread the answer data excluding the id
    questionId,
  });

  // Return the newly created answer as a plain object
  return newAnswer.toJSON(); // This includes the generated id
};
// Update an existing answer by ID
export const updateAnswer = async (id: number, answerData: Partial<AnswerAttributes>): Promise<AnswerAttributes | null> => {
  const [updatedCount, [updatedAnswer]] = await db.Answer.update(answerData, {
    where: { id },
    returning: true, // Return the updated answer
  });

  return updatedCount > 0 ? updatedAnswer : null; // Return the updated answer or null if not found
};

// Delete an answer by ID
export const deleteAnswer = async (id: number): Promise<boolean> => {
  const deletedCount = await db.Answer.destroy({
    where: { id },
  });
  return deletedCount > 0; // Return true if a record was deleted
};
