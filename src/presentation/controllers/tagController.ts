// src/presentation/controllers/tagController.ts
import { Request, Response } from "express";
import { TagService } from "../../application/services/tagService";

export class TagController {
  constructor(private readonly tagService: TagService) {}

  addNewTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await this.tagService.addNewTag(documentId, name);
      res.status(200).json({
        message: "Tag added successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to add new tag" });
    }
  };

  updateTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({
        error: "'oldName' and 'newName' are required.",
      });
    }

    try {
      const updatedDocument = await this.tagService.updateTag(
        documentId,
        oldName,
        newName
      );
      res.status(200).json({
        message: "Tag updated successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to update tag" });
    }
  };

  deleteTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await this.tagService.deleteTag(documentId, name);
      res.status(200).json({
        message: "Tag deleted successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to delete tag" });
    }
  };
}
