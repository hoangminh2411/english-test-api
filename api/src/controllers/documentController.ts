// controllers/documentController.ts
import { Request, Response, NextFunction } from 'express';
import * as documentService from '../services/documentService';
import { handleResponse } from '../utils/handleResponse';
import { handleError } from '../utils/errorHandler';

// Create a new document
export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, type } = req.body;

    // Check if the document already exists
    const existingDocument = await documentService.findDocumentByUrl(url);
    if (existingDocument) {
      return handleResponse(res, 400, 'Document already exists', null);
    }

    // Create the new document
    const newDocument = await documentService.createDocument({ url, type });
    handleResponse(res, 201, 'Document created successfully', newDocument);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Retrieve a document by URL
export const getDocumentByUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.params; // Get the URL from request parameters
    const document = await documentService.findDocumentByUrl(url);

    if (!document) {
      return handleResponse(res, 404, 'Document not found', null);
    }

    handleResponse(res, 200, 'Document retrieved successfully', document);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Optional: Function to get a document by ID
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id); // Get the document ID from request parameters
    const document = await documentService.getDocumentById(documentId);

    if (!document) {
      return handleResponse(res, 404, 'Document not found', null);
    }

    handleResponse(res, 200, 'Document retrieved successfully', document);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Optional: Function to update a document
export const updateDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id); // Get the document ID from request parameters
    const { url, type } = req.body; // Extract updated fields from the request body

    const updatedDocument = await documentService.updateDocument(documentId, { url, type });
    if (!updatedDocument) {
      return handleResponse(res, 404, 'Document not found', null);
    }

    handleResponse(res, 200, 'Document updated successfully', updatedDocument);
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};

// Optional: Function to delete a document
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = Number(req.params.id); // Get the document ID from request parameters
    const deleted = await documentService.deleteDocument(documentId);

    if (!deleted) {
      return handleResponse(res, 404, 'Document not found', null);
    }

    handleResponse(res, 204, 'Document deleted successfully');
  } catch (error) {
    handleError(res, error); // Use the common error handler
  }
};
