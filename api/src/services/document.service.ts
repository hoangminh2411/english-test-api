import db from '../models';
import { DocumentAttributes } from '../models/document';

export default class DocumentService {
  /**
   * Find a document by its URL
   */
  public async findDocumentByUrl(url: string): Promise<DocumentAttributes | null> {
    return await db.Document.findOne({ where: { url } });
  }

  /**
   * Create a new document
   */
  public async createDocument(data: Omit<DocumentAttributes, 'id'>): Promise<DocumentAttributes> {
    return await db.Document.create(data as any);
  }

  /**
   * Get a document by its ID
   */
  public async getDocumentById(id: number): Promise<DocumentAttributes | null> {
    return await db.Document.findByPk(id);
  }

  /**
   * Update an existing document by its ID
   */
  public async updateDocument(
    id: number,
    data: Partial<Omit<DocumentAttributes, 'id'>>
  ): Promise<DocumentAttributes | null> {
    const [updatedCount] = await db.Document.update(data, { where: { id } });

    return updatedCount > 0 ? await this.getDocumentById(id) : null;
  }

  /**
   * Delete a document by its ID
   */
  public async deleteDocument(id: number): Promise<boolean> {
    const deleted = await db.Document.destroy({ where: { id } });
    return deleted > 0;
  }
}
