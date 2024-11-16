import { Request, Response, NextFunction } from 'express';
import DocumentService from '../services/document.service';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

const documentService = new DocumentService();

/**
 * Create a new document
 */
export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, type } = req.body;

    if (!url || !type) {
      return handleError(res, new Error('URL and type are required'));
    }

    // Check if the document already exists
    const existingDocument = await documentService.findDocumentByUrl(url);
    if (existingDocument) {
      return handleError(res, new Error('Document already exists'));
    }

    // Create the new document
    const newDocument = await documentService.createDocument({ url, type });
    handleResponse(res, 201, 'Document created successfully', newDocument);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Retrieve a document by URL
 */
export const getDocumentByUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.params;

    if (!url) {
      return handleError(res, new Error('URL is required'));
    }

    const document = await documentService.findDocumentByUrl(url);

    if (!document) {
      return handleError(res, new Error('Document not found'));
    }

    handleResponse(res, 200, 'Document retrieved successfully', document);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Retrieve a document by ID
 */
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id);

    if (isNaN(documentId)) {
      return handleError(res, new Error('Invalid document ID'));
    }

    const document = await documentService.getDocumentById(documentId);

    if (!document) {
      return handleError(res, new Error('Document not found'));
    }

    handleResponse(res, 200, 'Document retrieved successfully', document);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Update a document by ID
 */
export const updateDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id);

    if (isNaN(documentId)) {
      return handleError(res, new Error('Invalid document ID'));
    }

    const { url, type } = req.body;

    if (!url && !type) {
      return handleError(res, new Error('At least one field (URL or type) is required'));
    }

    const updatedDocument = await documentService.updateDocument(documentId, { url, type });

    if (!updatedDocument) {
      return handleError(res, new Error('Document not found'));
    }

    handleResponse(res, 200, 'Document updated successfully', updatedDocument);
  } catch (error) {
    handleError(res, error)
  }
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id);

    if (isNaN(documentId)) {
      return handleError(res, new Error('Invalid document ID'));
    }

    const deleted = await documentService.deleteDocument(documentId);

    if (!deleted) {
      return handleError(res, new Error('Document not found'));
    }

    handleResponse(res, 204, 'Document deleted successfully');
  } catch (error) {
    handleError(res, error)
  }
};
