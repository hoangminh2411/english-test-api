import { IdName } from './common';
import { IQuestion } from './question';



// Main Exam interface
export interface IExam {
  id: number;
  name: string;
  note: string;
  totalTime: number; // Total time in seconds
  questions: IQuestion[]; // List of questions
  totalExamies: number; // Total examinees
  totalQuestions: number; // Total number of questions
  totalSkills: number; // Number of unique skills tested
  createdBy: IdName; // Information about the creator
  updatedBy: IdName; // Information about the last person who updated
  updatedAt: string; // Last updated timestamp
  createdAt: string; // Creation timestamp
}
