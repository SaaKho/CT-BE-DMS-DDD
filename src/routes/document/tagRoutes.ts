import express, { Request, Response } from "express";
import { authMiddleware, authorizeRole } from "../../middleware/authMiddleware";
import {
  addTagToDocument,
  updateTagInDocument,
  deleteTagFromDocument,
} from "../../services/tagServices";

const router = express.Router();
router.use(authMiddleware);

// Add a new tag to a document
router.post(
  "/addNewTag/:documentId",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await addTagToDocument(documentId, name);
      res
        .status(200)
        .json({ message: "Tag added successfully", document: updatedDocument });
    } catch (error: any) {
      console.error("Error adding tag:", error);
      res.status(500).json({ error: error.message || "Failed to add tag" });
    }
  }
);

// Update an existing tag in a document
router.put(
  "/updateTag/:documentId",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res
        .status(400)
        .json({ error: "'oldName' and 'newName' are required." });
    }

    try {
      const updatedDocument = await updateTagInDocument(
        documentId,
        oldName,
        newName
      );
      res.status(200).json({
        message: "Tag updated successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: error.message || "Failed to update tag" });
    }
  }
);

// Delete a tag from a document
router.delete(
  "/deleteTag/:documentId",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await deleteTagFromDocument(documentId, name);
      res.status(200).json({
        message: "Tag deleted successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: error.message || "Failed to delete tag" });
    }
  }
);

export default router;
