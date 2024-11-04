import { Request, Response } from "express";
import {
  addNewTagService,
  updateTagService,
  deleteTagService,
} from "../services/tagService";

// Refactoring TagController to use static methods
export class TagController {
  // Static method to add a new tag
  static async addNewTag(req: Request, res: Response) {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await addNewTagService(documentId, name);
      res.status(200).json({
        message: "Tag added successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      console.error("Error adding new tag:", error);
      res.status(500).json({ error: "Failed to add new tag" });
    }
  }

  // Static method to update a tag
  static async updateTag(req: Request, res: Response) {
    const { documentId } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({
        error: "'oldName' and 'newName' are required.",
      });
    }

    try {
      const updatedDocument = await updateTagService(
        documentId,
        oldName,
        newName
      );
      res.status(200).json({
        message: "Tag updated successfully",
        document: updatedDocument[0],
      });
    } catch (error: any) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Failed to update tag" });
    }
  }

  // Static method to delete a tag
  static async deleteTag(req: Request, res: Response) {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await deleteTagService(documentId, name);
      res.status(200).json({
        message: "Tag deleted successfully",
        document: updatedDocument[0],
      });
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  }
}
