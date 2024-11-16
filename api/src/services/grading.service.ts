import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.C_API_KEY || '',
});

export default class GradingService {
  /**
   * Grades a free-text answer using Cohere's AI model.
   */
  public async gradeFreeTextAnswer(
    question: string,
    answer: string
  ): Promise<{ score: number; feedback: string }> {
    try {
      const prompt = `
      You are an IELTS examiner. Grade the following answer to an IELTS question on a scale from 0 to 9. Provide feedback in a structured format, covering Grammar, Relevance, Organization, and Clarity.

      Question: "${question}"
      Answer: "${answer}"

      Respond with the following format:
      Score: (numeric score)
      Summary Feedback: (overall impression)`;

      const response = await cohere.generate({
        model: 'command-nightly', // Use the largest model for accuracy
        prompt: prompt,
        maxTokens: 200,
        temperature: 0.7,
      });

      const feedbackWithScore = response.generations[0].text;
      console.log('Raw Feedback with Score:', feedbackWithScore);

      const score = this.extractScoreFromFeedback(feedbackWithScore);

      // Clean feedback by removing the "Score:" line if present
      const feedback = feedbackWithScore.replace(/Score:\s*\d+/, '').trim();

      return { score, feedback };
    } catch (error) {
      console.error('Error grading free-text answer:', error);
      throw new Error('Failed to grade free-text answer.');
    }
  }

  /**
   * Helper function to extract a score from the feedback text.
   */
  private extractScoreFromFeedback(feedback: string): number {
    const match = feedback.match(/Score:\s*(\d+)/);
    if (match) return parseInt(match[1], 10);

    // Fallback score mechanism if no explicit score is found
    if (/excellent|outstanding|very good/i.test(feedback)) return 9;
    if (/good|solid|fairly complete/i.test(feedback)) return 7;
    if (/average|ok|could be better/i.test(feedback)) return 5;
    if (/poor|needs improvement|major issues/i.test(feedback)) return 3;

    return 0; // Default score
  }
}
