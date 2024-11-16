import { IExam } from "../interfaces/exam";
import { RawExamData } from "../interfaces/raw-exam-data";


export const toExamDTO = (examData: RawExamData, isGetQuestions =false): any => {
  return {
    id: examData.id,
    name: examData.name,
    note: examData.note,
    totalTime: examData.totalTime,
    questions:isGetQuestions ?  examData.questions.map((question: any) => ({
      id: question.id,
      examId: question.examId,
      parentId: question.parentId,
      content: question.content,
      document: {
        type: question.document?.type,
        url: question.document?.url,
        metadata: question.document?.metadata || {},
      },
      type: question.type,
      order: question.order,
      answers: question.answers?.map((answer: any) => ({
        id: answer.id,
        questionId: answer.questionId,
        isCorrect: answer.isCorrect,
        content: answer.content,
        order: answer.order,
        updatedBy: answer.updatedBy,
        updatedAt: answer.updatedAt,
        createdAt: answer.createdAt,
      })) || [],
      createdBy: question.createdBy,
      updatedBy: question.updatedBy,
      updatedAt: question.updatedAt,
      createdAt: question.createdAt,
    })): [],
    totalExamies:  new Set(examData?.attempts?.map((q) => q.userId)).size,
    totalQuestions: examData.questions.length,
    totalSkills: new Set(examData.questions.map((q: any) => q.type)).size,
    createdBy: examData.createdBy,
    updatedBy: examData.updatedBy,
    updatedAt: examData.updatedAt,
    createdAt: examData.createdAt,
  };
};
