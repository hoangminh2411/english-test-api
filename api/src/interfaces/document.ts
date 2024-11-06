// interfaces/ExamDocument.ts

export type DocumentType = 'IMAGE' | 'AUDIO';

export interface ExamDocument {
  type: DocumentType;
  url: string;
  metadata?: { [key: string]: any };
}
