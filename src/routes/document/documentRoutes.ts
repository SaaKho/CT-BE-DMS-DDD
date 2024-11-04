import express from "express";
import { DocumentController } from "../../controllers/documentController";
import { loginMiddleware } from "../../middleware/loginMiddleware";
import { roleMiddleware } from "../../middleware/roleMiddleware";
import { adminMiddleware } from "../../middleware/adminMiddleware";

const router = express.Router();

// Route to create a new document (only authenticated users can create documents)
router.post("/create", loginMiddleware, DocumentController.createNewDocument);

// Route to get a document (Owner, Editor, and Viewer can access)
router.get(
  "/:documentId",
  loginMiddleware,
  roleMiddleware("Viewer"), // Viewer, Editor, and Owner can access
  DocumentController.getDocument
);

// Route to update a document (only Owner and Editor can update)
router.put(
  "/:documentId",
  loginMiddleware,
  roleMiddleware("Editor"), // Editor and Owner can update
  DocumentController.updateDocument
);

// Route to delete a document (only Owner or Admin can delete)
router.delete(
  "/:documentId",
  loginMiddleware,
  adminMiddleware, // Admin can delete any document
  roleMiddleware("Owner"), // Only Owner can delete
  DocumentController.deleteDocument
);

export default router;
