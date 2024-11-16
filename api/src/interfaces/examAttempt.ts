export interface IExamAttempt {
  id: number;
  examId: number;
  userId: number;
  status: 'in_progress' | 'completed' | 'canceled';
  score?: number;
  startedAt?: Date;
  finishedAt?: Date;
  exam?: any; // You can replace `any` with `IExam` if you have it defined
  candidate?: any; // You can replace `any` with `IUser` if you have it defined
  results?: any[]; // Replace `any` with `IResult` if defined
}
