export interface IExamSubmission {
  userId: number; // The ID of the user taking the exam
  examId: number; // The ID of the exam being taken
  answers: {
    questionId: number; // The ID of the question being answered
    selectedAnswer: string; // The user's answer, can be a text or choice
  }[]; // An array of answers to each question
}