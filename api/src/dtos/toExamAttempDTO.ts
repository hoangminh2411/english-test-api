export const toExamAttemptDTO = (data: RawExamAttemptData): IExamAttempt => {
  return {
    id: data.id,
    examId: data.examId,
    userId: data.userId,
    status: data.status,
    score: data.score,
    startedAt: data.startedAt,
    finishedAt: data.finishedAt,
    exam: data.exam,
    candidate: data.candidate,
    results: data.results,
  };
};
