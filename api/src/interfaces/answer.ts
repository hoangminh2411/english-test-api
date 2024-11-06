import { IdName } from "./common";


export interface IAnswer {
  id: number;
  questionId: number; // ID of the question this answer is associated with
  isCorrect?: boolean; // Indicates if this answer is correct
  content: string; // Content of the answer
  order: number; // Order of the answer in the list of answers
  updatedBy: IdName; // Last person who updated the answer
  updatedAt: string; // Last updated timestamp
  createdAt: string; // Creation timestamp
}
