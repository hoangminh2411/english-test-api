// routes/documentRoutes.ts
import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware'; // Protect routes
import * as documentController from '../controllers/documentController';

const router = express.Router();

// Create a new document
router.post('/', authenticateJWT, documentController.createDocument);

// Retrieve a document by URL
router.get('/:url', authenticateJWT, documentController.getDocumentByUrl);

// Optional: Retrieve a document by ID
router.get('/id/:id', authenticateJWT, documentController.getDocumentById);

// Optional: Update a document by ID
router.put('/id/:id', authenticateJWT, documentController.updateDocument);

// Optional: Delete a document by ID
router.delete('/id/:id', authenticateJWT, documentController.deleteDocument);

export default router;
