import { Request, Response } from "express";
import { SearchService } from "../../application/services/searchService";

export class SearchController {
  private static searchService: SearchService;

  static setSearchService(service: SearchService) {
    SearchController.searchService = service;
  }

  static advancedSearch = async (req: Request, res: Response) => {
    const { tags, fileName, contentType } = req.query;

    const parsedTags = (tags as string)?.split(",") || [];

    try {
      const results = await SearchController.searchService.advancedSearch(
        parsedTags,
        fileName as string,
        contentType as string
      );
      res.status(200).json({
        message: "Documents retrieved successfully",
        documents: results,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to retrieve documents" });
    }
  };
}
