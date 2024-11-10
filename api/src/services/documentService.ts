// services/documentService.ts
import db from '../models'; // Import your database models
import { DocumentAttributes } from '../models/document';


// Function to find a document by its URL
export const findDocumentByUrl = async (url: string): Promise<DocumentAttributes | null> => {
  return await db.Document.findOne({ where: { url } });
};

// Function to create a new document
export const createDocument = async (data: Omit<DocumentAttributes, 'id'>): Promise<DocumentAttributes> => {
  return await db.Document.create(data as any);
};

// Optional: Function to get a document by ID (if needed)
export const getDocumentById = async (id: number): Promise<DocumentAttributes | null> => {
  return await db.Document.findByPk(id);
};

// Optional: Function to update a document (if needed)
export const updateDocument = async (
  id: number,
  data: Partial<Omit<DocumentAttributes, 'id'>>
): Promise<DocumentAttributes | null> => {
  const [updatedCount] = await db.Document.update(data, { where: { id } });

  // Nếu có bản ghi được cập nhật, lấy lại document từ DB
  return updatedCount > 0 ? await db.Document.findByPk(id) : null;
};

// Optional: Function to delete a document (if needed)
export const deleteDocument = async (id: number): Promise<boolean> => {
  const deleted = await db.Document.destroy({ where: { id } });
  return deleted > 0; // Return true if at least one record was deleted
};
