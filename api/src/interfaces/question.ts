import { IAnswer } from "./answer";
import { IdName } from "./common";
import { ExamDocument } from "./document";


// Question type for each skill
export type QuestionType = 'SPEAKING' | 'LISTENING' | 'READING' | 'WRITING';

// Main Question interface
export interface IQuestion {
  id: number;
  examId: number;
  parentId?: number; // For nested questions (if any)
  content?: string; // HTML content of the question
  document: ExamDocument; // Document associated with the question (if any)
  type: QuestionType; // Type of question
  order: number; // Order of the question in the exam
  answers?: IAnswer[]; // List of answers (for multiple-choice questions)
  createdBy: IdName; // Creator of the question
  updatedBy: IdName; // Last person who updated the question
  updatedAt: string; // Last updated timestamp
  createdAt: string; // Creation timestamp
}
