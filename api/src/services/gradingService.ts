import fs from 'fs';
import path from 'path';
import { CohereClient } from "cohere-ai";
const cohere = new CohereClient({
  token: process.env.C_API_KEY,
});


/**
 * Grades a free-text answer by sending it to Cohere for evaluation.
 * @param question - The original question that the user is answering.
 * @param answer - The user's text answer to be graded.
 * @returns An object containing the score (0-9) and feedback.
 */
export const gradeFreeTextAnswer = async (question: string, answer: string): Promise<{ score: number; feedback: string }> => {
  try {
    const prompt = `
    You are an IELTS examiner. Grade the following answer to an IELTS question on a scale from 0 to 9. Provide feedback in a structured format, covering Grammar, Relevance, Organization, and Clarity.

    Question: "${question}"
    Answer: "${answer}"

    Respond with the following format:
    Score: (numeric score)
    Summary Feedback: (overall impression)`;

    const response = await cohere.generate({
      model: 'command-nightly',  // Use the largest model for accuracy
      prompt: prompt,
      maxTokens: 200,
      temperature: 0.7,
    });

    const feedbackWithScore = response.generations[0].text;
    console.log('Raw Feedback with Score:', feedbackWithScore);

    // Extract the score using a regex match
    const scoreMatch = feedbackWithScore.match(/Score:\s*(\d+)/);
    let score = scoreMatch ? parseInt(scoreMatch[1], 10) : undefined;

    // Fallback score mechanism based on keywords if no score is found
    if (score === undefined) {
      if (/excellent|outstanding|very good/i.test(feedbackWithScore)) score = 9;
      else if (/good|solid|fairly complete/i.test(feedbackWithScore)) score = 7;
      else if (/average|ok|could be better/i.test(feedbackWithScore)) score = 5;
      else if (/poor|needs improvement|major issues/i.test(feedbackWithScore)) score = 3;
      else score = 0; // Default score if no clues are available
    }

    // Clean feedback text by removing the "Score:" line if present
    const feedback = feedbackWithScore.replace(/Score:\s*\d+/, '').trim();

    return { score, feedback };
  } catch (error) {
    console.error('Error grading free-text answer:', error);
    throw new Error('Failed to grade free-text answer.');
  }
};

/**
 * Grades an audio answer by first transcribing it, then sending the transcription for evaluation.
 * @param question - The original speaking prompt or question.
 * @param audioFilePath - Path to the user's audio response file.
 * @returns An object containing the score (0-9) and feedback based on the transcription.
 */
// export const gradeSpeakingAnswer = async (question: string, audioFilePath: string): Promise<{ score: number; feedback: string }> => {
//   try {
//     // Step 1: Transcribe audio using Whisper (or any other transcription service)
//     const audioFile = fs.createReadStream(path.resolve(audioFilePath));
//     const transcriptionResponse = await openai.audio.transcriptions.create({
//       file: audioFile,
//       model: 'whisper-1'
//     });
//     const transcription = transcriptionResponse.text;

//     console.log(`Transcription: ${transcription}`);

//     // Step 2: Send transcription for grading
//     const prompt = `Evaluate the following response to the question and provide a score from 0 to 9. Provide feedback on grammar, fluency, pronunciation, and relevance.
//     Question: "${question}"
//     Transcription: "${transcription}"
//     Score:`;

//     const response = await cohere.classify({
//       model: 'large',
//       inputs: [prompt],
//       examples: [
//         {text: "This response is clear and fluent with good pronunciation.", label: "9"},
//         {text: "The response is understandable but has some pronunciation issues.", label: "7"},
//         {text: "The response has multiple grammatical errors and lacks clarity.", label: "4"},
//         {text: "The response is incomprehensible and does not answer the question.", label: "2"},
//       ],
//     });

//     const feedback = response.classifications[0].prediction || "No feedback available";
//     const score = parseInt(response.classifications[0].prediction, 10);

//     return { score, feedback };
//   } catch (error) {
//     console.error('Error grading speaking answer:', error);
//     throw new Error('Failed to grade speaking answer.');
//   }
// };

/**
 * Helper function to extract a score from the feedback text.
 * Assumes the score is mentioned in the format "Score: X".
 * @param feedback - The feedback text.
 * @returns The score as a number.
 */
const extractScoreFromFeedback = (feedback: string): number => {
  const match = feedback.match(/Score:\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};
