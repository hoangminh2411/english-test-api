// interfaces/RawExamData.ts

import { IdName } from "./common";
import { ExamDocument } from "./document";
import { QuestionType } from "./question";



// Define the structure for a raw Answer object
export interface RawAnswer {
  id: number;
  questionId: number;
  isCorrect?: boolean;
  content: string;
  order: number;
  updatedBy: IdName;
  updatedAt: string;
  createdAt: string;
}

// Define the structure for a raw Question object
export interface RawQuestion {
  id: number;
  examId: number;
  parentId?: number;
  content?: string;
  document?: ExamDocument;
  type: QuestionType;
  order: number;
  answers?: RawAnswer[];
  createdBy: IdName;
  updatedBy: IdName;
  updatedAt: string;
  createdAt: string;
}

// Define the structure for raw Exam data including nested relationships
export interface RawExamData {
  id: number;
  name: string;
  note: string;
  totalTime: number;
  questions: RawQuestion[];
  totalExamies?: number;
  createdBy: IdName;
  updatedBy: IdName;
  updatedAt: string;
  createdAt: string;
}
