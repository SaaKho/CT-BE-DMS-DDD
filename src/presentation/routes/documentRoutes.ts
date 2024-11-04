import express from "express";
import { DocumentController } from "../controllers/documentController";
import { container } from "../../inversify/config";
import { DocumentService } from "../../application/services/documentService";
import { AuthMiddleware } from "../middleware/authMiddleware"; // Import AuthMiddleware
import multer from "multer";

// Create a router
const router = express.Router();

// Manually inject the DocumentService into the controller
const documentService = container.get<DocumentService>("DocumentService");
DocumentController.setDocumentService(documentService);

// Resolve AuthMiddleware via the Inversify container
const authMiddleware = container.get<AuthMiddleware>("AuthMiddleware");

// Configure multer to store files in the 'uploads/' directory
const upload = multer({ dest: "uploads/" });

// Define routes with AuthMiddleware for protected routes
router.post(
  "/create",
  authMiddleware.authenticate,
  DocumentController.createNewDocument
);
router.get(
  "/:documentId",
  authMiddleware.authenticate,
  DocumentController.getDocument
);
router.put(
  "/:documentId",
  authMiddleware.authenticate,
  DocumentController.updateDocument
);
router.delete(
  "/:documentId",
  authMiddleware.authenticate,
  DocumentController.deleteDocument
);

router.post(
  "/upload/:documentId",
  authMiddleware.authenticate,
  upload.single("file"),
  DocumentController.uploadDocument
);

export default router;
