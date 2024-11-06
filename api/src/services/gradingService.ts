import OpenAIApi from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize the OpenAI API client with the API key
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your API key in environment variables
});

/**
 * Grades a free-text answer by sending it to OpenAI for evaluation.
 * @param question - The original question that the user is answering.
 * @param answer - The user's text answer to be graded.
 * @returns An object containing the score (0-10) and feedback.
 */
export const gradeFreeTextAnswer = async (question: string, answer: string): Promise<{ score: number; feedback: string }> => {
  try {
    const prompt = `Grade the following answer on a scale from 0 to 10, with 10 being the highest. Provide feedback explaining the score.
    Question: "${question}"
    Answer: "${answer}"
    Score:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
       messages:[
        { role: "system", content: "You are a Ielt Teacher." },
        {
        role:'user',
        content: prompt
       }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const feedback = response.choices[0]?.message.content || "No feedback available";
    const score = extractScoreFromFeedback(feedback);

    return { score, feedback };
  } catch (error) {
    console.error('Error grading free-text answer:', error);
    throw new Error('Failed to grade free-text answer.');
  }
};

/**
 * Grades an audio answer by first transcribing it using OpenAI's whisper model,
 * then sending the transcription for evaluation.
 * @param question - The original speaking prompt or question.
 * @param audioFilePath - Path to the user's audio response file.
 * @returns An object containing the score (0-10) and feedback based on the transcription.
 */
export const gradeSpeakingAnswer = async (question: string, audioFilePath: string): Promise<{ score: number; feedback: string }> => {
  try {
    // Step 1: Transcribe audio using Whisper model
    const audioFile = fs.createReadStream(path.resolve(audioFilePath));

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1'
    });
    const transcription = transcriptionResponse.text;

    console.log(`Transcription: ${transcription}`);

    // Step 2: Send transcription for grading
    const prompt = `Evaluate the following response to the question and provide a score from 0 to 10. Provide feedback on grammar, fluency, pronunciation, and relevance.
    Question: "${question}"
    Transcription: "${transcription}"
    Score:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
       messages:[
        { role: "system", content: "You are a Ielt Teacher." },
        {
        role:'user',
        content: prompt
       }],
      max_tokens: 100,
      temperature: 0.7,
    });


    const feedback = response.choices[0]?.message.content || "No feedback available";
    const score = extractScoreFromFeedback(feedback);

    return { score, feedback };
  } catch (error) {
    console.error('Error grading speaking answer:', error);
    throw new Error('Failed to grade speaking answer.');
  }
};

/**
 * Helper function to extract a score from the feedback text.
 * Assumes the score is mentioned in the format "Score: X".
 * @param feedback - The feedback text from OpenAI.
 * @returns The score as a number.
 */
const extractScoreFromFeedback = (feedback: string): number => {
  const match = feedback.match(/Score:\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};
