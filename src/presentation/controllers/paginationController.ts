import { Request, Response } from "express";
import { PaginationService } from "../../application/services/paginationService";

export class PaginationController {
  private static paginationService: PaginationService;

  static setPaginationService(service: PaginationService) {
    PaginationController.paginationService = service;
  }

  // Validate pagination parameters
  private static validatePaginationParams(
    page: string,
    limit: string
  ): { page: number; limit: number } {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    if (isNaN(parsedPage) || parsedPage <= 0) {
      throw new Error("Invalid page number");
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new Error("Invalid limit number");
    }

    return { page: parsedPage, limit: parsedLimit };
  }

  // Get paginated documents
  static getPaginatedDocuments = async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "10" } = req.query as {
        page: string;
        limit: string;
      };
      const { page: validPage, limit: validLimit } =
        PaginationController.validatePaginationParams(page, limit);

      const paginatedData =
        await PaginationController.paginationService.getPaginatedDocuments(
          validPage,
          validLimit
        );

      return res.status(200).json(paginatedData);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to fetch paginated documents",
        error,
      });
    }
  };

  // Get paginated users
  static getPaginatedUsers = async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "10" } = req.query as {
        page: string;
        limit: string;
      };
      const { page: validPage, limit: validLimit } =
        PaginationController.validatePaginationParams(page, limit);

      const paginatedData =
        await PaginationController.paginationService.getPaginatedUsers(
          validPage,
          validLimit
        );

      return res.status(200).json(paginatedData);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to fetch paginated users",
        error,
      });
    }
  };
}
