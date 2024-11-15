import { IExamSubmission } from '../interfaces/exam-submission';
import { QuestionType } from '../interfaces/question';
import db from '../models';
import { CreateResultAttributes } from '../models/result';
import { roundUpToDecimal } from '../utils/helper';
import * as gradingService from './gradingService';
import { AssemblyAI } from 'assemblyai'
const client = new AssemblyAI({
  apiKey: process.env.A_API_KEY || ""
})

interface SkillScores {
  listening: number;
  reading: number;
  speaking: number;
  writing: number;
}

// Main function to process the entire exam submission
export const processSubmission = async (submissionData: IExamSubmission) => {
  const { userId, examId, answers } = submissionData;

  const questionCounts: SkillScores = { listening: 35, reading: 40, speaking: 3, writing: 2 };
  const rawScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };

  const transaction = await db.sequelize.transaction();
  try {
    // Batch fetch all questions
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await db.Question.findAll({
      where: { id: questionIds },
      transaction
    });
    const questionsMap = new Map(questions.map((q) => [q.id, q]));

    await Promise.all(
      answers.map(async (answer) => {
        const question = questionsMap.get(answer.questionId);
        if (!question) throw new Error(`Question ID ${answer.questionId} not found`);

        const questionData = question.get({ plain: true });

        if (questionData.type === 'LISTENING' || questionData.type === 'READING') {
          const isCorrect = await handleMultipleChoiceAnswer(userId, examId, answer, transaction);
          if (isCorrect) {
            questionData.type === 'LISTENING' ? rawScores.listening++ : rawScores.reading++;
          }
        } else if (questionData.type === 'WRITING' || questionData.type === 'SPEAKING') {
          const freeTextScore = await handleFreeTextAnswer(
            userId,
            examId,
            answer,
            questionData.content,
            transaction,
            questionData.type
          );

          questionData.type === 'SPEAKING' ? (rawScores.speaking += freeTextScore) : (rawScores.writing += freeTextScore);
        }
      })
    );

    const finalScores: SkillScores = {
      listening: (rawScores.listening / questionCounts.listening) * 9,
      reading: (rawScores.reading / questionCounts.reading) * 9,
      speaking: rawScores.speaking / questionCounts.speaking,
      writing: rawScores.writing / questionCounts.writing,
    };

    for (const skill in finalScores) {
      finalScores[skill as keyof SkillScores] = parseFloat(finalScores[skill as keyof SkillScores].toFixed(1));
    }

    await transaction.commit();
    return { success: true, scores: finalScores };
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
  const score = isCorrect ?  1 : 0;
  await saveAnswer(userId, examId, answer.questionId, answer.selectedAnswer, isCorrect, transaction,score);
  return isCorrect;
};

// Helper to process free-text answers and call OpenAI for grading
const handleFreeTextAnswer = async (
  userId: number,
  examId: number,
  answer: { questionId: number; selectedAnswer: string },
  questionContent: string,
  transaction: any,
  questionType:QuestionType
): Promise<number> => {
  let answerContent = answer.selectedAnswer
  if(questionType == 'SPEAKING') {
    const transcript = await client.transcripts.transcribe({
      audio_url: answer.selectedAnswer
    })
    answerContent  = transcript?.text??""
  }

  const grading = await gradingService.gradeFreeTextAnswer(questionContent, answerContent);
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
  // Count of questions for each skill
  const questionCounts: SkillScores = { listening: 35, reading: 40, speaking: 3, writing: 2 }; // Example values for each skill
  const rawScores: SkillScores = { listening: 0, reading: 0, speaking: 0, writing: 0 };

  results.forEach((result:any) => {
    const questionType = result.question?.type; // Use optional chaining for safety
    const resultScore = result.score || 0;

    if (questionType === 'LISTENING' && result.score == 1) rawScores.listening += 1;
    else if (questionType === 'READING' &&result.score == 1) rawScores.reading += 1;
    else if (questionType === 'SPEAKING') rawScores.speaking += resultScore;
    else if (questionType === 'WRITING') rawScores.writing += resultScore;
  });

  const finalScores: SkillScores = {
    listening: (rawScores.listening / questionCounts.listening) * 9,
    reading: (rawScores.reading / questionCounts.reading)* 9 ,
    speaking: rawScores.speaking /questionCounts.speaking,
    writing: rawScores.writing / questionCounts.writing,
  };

  for (const skill in finalScores) {
    finalScores[skill as keyof SkillScores] = parseFloat(finalScores[skill as keyof SkillScores].toFixed(1));
  }
  console.log("finalScores", finalScores, rawScores)


  return finalScores;
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

