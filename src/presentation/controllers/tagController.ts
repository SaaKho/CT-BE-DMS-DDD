import { Request, Response } from "express";
import { TagService } from "../../domain/services/tagService";

export class TagController {
  private static tagService: TagService;

  static setTagService(service: TagService) {
    TagController.tagService = service;
  }

  static addNewTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await TagController.tagService.addNewTag(
        documentId,
        name
      );
      res.status(200).json({
        message: "Tag added successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to add new tag" });
    }
  };

  static updateTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({
        error: "'oldName' and 'newName' are required.",
      });
    }

    try {
      const updatedDocument = await TagController.tagService.updateTag(
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

  static deleteTag = async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "'name' is required." });
    }

    try {
      const updatedDocument = await TagController.tagService.deleteTag(
        documentId,
        name
      );
      res.status(200).json({
        message: "Tag deleted successfully",
        document: updatedDocument,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to delete tag" });
    }
  };
}
