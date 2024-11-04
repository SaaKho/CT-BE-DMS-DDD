// SearchController.ts
import { Request, Response } from "express";
import { advancedSearchDocuments } from "../services/searchService";

export class SearchController {
  async advancedSearch(req: Request, res: Response) {
    const { tags, fileName, contentType } = req.query;

    try {
      const results = await advancedSearchDocuments(
        tags as string,
        fileName as string,
        contentType as string
      );

      res.status(200).json({
        message: "Documents retrieved successfully",
        documents: results,
      });
    } catch (error: any) {
      console.error("Error retrieving documents:", error);
      res.status(500).json({ error: "Failed to retrieve documents" });
    }
  }
}
