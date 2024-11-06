import { IExamSubmission } from '../interfaces/exam-submission';
import db from '../models';
import { CreateResultAttributes } from '../models/result';
import * as gradingService from './gradingService';


interface SkillScores {
  listening: number;
  reading: number;
  speaking: number;
  writing: number;
}

// Main function to process the entire exam submission
export const processSubmission = async (submissionData: IExamSubmission) => {
  const { userId, examId, answers } = submissionData;
  const skillScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };

  const transaction = await db.sequelize.transaction();
  try {
    for (const answer of answers) {
      const question = await db.Question.findByPk(answer.questionId);
      
      if (!question) throw new Error(`Question ID ${answer.questionId} not found`);
      const questionData = question.get({ plain: true })
      if (questionData.type === 'LISTENING' || questionData.type === 'READING') {
        const isCorrect = await handleMultipleChoiceAnswer(userId, examId, answer, transaction);
        if (isCorrect) {
          questionData.type === 'LISTENING' ? skillScores.listening++ : skillScores.reading++;
        }
      } else if (questionData.type === 'SPEAKING' || questionData.type === 'WRITING') {
        const freeTextScore = await handleFreeTextAnswer(userId, examId, answer, questionData.content, transaction);
        questionData.type === 'SPEAKING' ? skillScores.speaking += freeTextScore : skillScores.writing += freeTextScore;
      }
    }

    await transaction.commit();
    return { success: true, scores: skillScores };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Helper to process multiple-choice answers and determine correctness
const handleMultipleChoiceAnswer = async (
  userId: number,
  examId: number,
  answer: { questionId: number; selectedAnswer: string },
  transaction: any
): Promise<boolean> => {
  const correctAnswer = await db.Answer.findOne({
    where: { questionId: answer.questionId, isCorrect: true },
  });
  if (!correctAnswer) throw new Error(`Correct Answer not found`);
  const answerData = correctAnswer.get({ plain: true })

  const isCorrect = correctAnswer ? answerData.content === answer.selectedAnswer : false;
  await saveAnswer(userId, examId, answer.questionId, answer.selectedAnswer, isCorrect, transaction);
  return isCorrect;
};

// Helper to process free-text answers and call OpenAI for grading
const handleFreeTextAnswer = async (
  userId: number,
  examId: number,
  answer: { questionId: number; selectedAnswer: string },
  questionContent: string,
  transaction: any
): Promise<number> => {
  const grading = await gradingService.gradeFreeTextAnswer(questionContent, answer.selectedAnswer);
  await saveAnswer(userId, examId, answer.questionId, answer.selectedAnswer, null, transaction, grading.score, grading.feedback);
  return grading.score;
};

// Helper to save an individual answer to the Results table
const saveAnswer = async (
  userId: number,
  examId: number,
  questionId: number,
  selectedAnswer: string,
  isCorrect: boolean | null,
  transaction: any,
  score?: number,
  feedback?: string
) => {
  // Create a new result entry
  const newResultData: CreateResultAttributes = {
    userId,
    examId,
    questionId,
    selectedAnswer,
    isCorrect,
    score,
    feedback,
  };

  return await db.Result.create(newResultData as any, { transaction });
};

// Retrieve all results for a specific user and exam, including question details
export const getUserResultsByExam = async (userId: number, examId: number) => {
  return await db.Result.findAll({
    where: { userId, examId },
    include: [
      {
        model: db.Question,
        as: 'question',
        attributes: ['content', 'type'],
      },
    ],
  });
};

// Retrieve all results for a specific exam (for admin view)
export const getExamResults = async (examId: number) => {
  return await db.Result.findAll({
    where: { examId },
    include: [
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
};

// Calculate and return the overall score by skill for a user's exam
export const getOverallScoreBySkill = async (userId: number, examId: number): Promise<SkillScores> => {
  const results = await db.Result.findAll({
    where: { userId, examId },
    attributes: ['score'],
    include: [
      {
        model: db.Question,
        as: 'question',
        attributes: ['type'],
      },
    ],
  });

  const skillScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };

  results.forEach((result:any) => {
    const questionType = result.question?.type; // Use optional chaining for safety
    const resultScore = result.score || 0;

    if (questionType === 'LISTENING') skillScores.listening += resultScore;
    else if (questionType === 'READING') skillScores.reading += resultScore;
    else if (questionType === 'SPEAKING') skillScores.speaking += resultScore;
    else if (questionType === 'WRITING') skillScores.writing += resultScore;
  });

  return skillScores;
};
export function deleteResult(arg0: number) {
  throw new Error('Function not implemented.');
}

export function findResultById(arg0: number) {
  throw new Error('Function not implemented.');
}

export function createResult(body: any) {
  throw new Error('Function not implemented.');
}

export function updateResult(arg0: number, body: any) {
  throw new Error('Function not implemented.');
}

