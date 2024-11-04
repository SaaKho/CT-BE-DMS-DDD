import { Request, Response } from "express";
import {
  createDocumentService,
  getDocumentService,
  updateDocumentService,
  deleteDocumentService,
} from "../services/documentService";

// Define a local interface extending Express' Request to include the user property
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string }; // Define the structure of user
}

export class DocumentController {
  // Static method to create a new document
  static async createNewDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { fileName, fileExtension, contentType, tags } = req.body;
      const userId = req.user?.id; // Now TypeScript knows about req.user

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const newDocumentId = await createDocumentService(
        userId,
        fileName,
        fileExtension,
        contentType,
        tags
      );

      res.status(201).json({
        message: "Document created successfully",
        documentId: newDocumentId,
      });
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  }

  // Static method to get a document
  static async getDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { documentId } = req.params;
      const document = await getDocumentService(documentId);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({ document });
    } catch (error) {
      console.error("Error retrieving document:", error);
      res.status(500).json({ message: "Failed to retrieve document" });
    }
  }

  // Static method to update a document
  static async updateDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { documentId } = req.params;
      const updates = req.body;

      const updatedDocument = await updateDocumentService(documentId, updates);

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({
        message: "Document updated successfully",
        document: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  }

  // Static method to delete a document
  static async deleteDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { documentId } = req.params;

      await deleteDocumentService(documentId);

      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  }
}
