// routes/documentRoutes.ts
import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware'; // Protect routes
import * as documentController from '../controllers/document.controller';

const router = express.Router();

// Create a new document
router.post('/',  documentController.createDocument);

// Retrieve a document by URL
router.get('/:url',  documentController.getDocumentByUrl);

// Optional: Retrieve a document by ID
router.get('/id/:id',  documentController.getDocumentById);

// Optional: Update a document by ID
router.put('/id/:id',  documentController.updateDocument);

// Optional: Delete a document by ID
router.delete('/id/:id', documentController.deleteDocument);

export default router;
