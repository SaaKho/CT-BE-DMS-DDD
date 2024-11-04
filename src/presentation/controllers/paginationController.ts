// src/presentation/controllers/paginationController.ts

import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { PaginationService } from "../../application/services/paginationService";
import { PaginationInputDTO } from "../../application/DTOs/requests/pagination.dto";
import { Either, Ok, Failure } from "../../utils/monads";
import {
  PaginatedDocumentsResponseDTO,
  PaginatedUsersResponseDTO,
} from "../../application/DTOs/responses/paginationResponse.dto";

@injectable()
export class PaginationController {
  constructor(
    @inject("PaginationService")
    private readonly paginationService: PaginationService
  ) {}

  private validatePaginationParams(
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

  public getPaginatedDocuments = async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "10" } = req.query as {
        page: string;
        limit: string;
      };
      const { page: validPage, limit: validLimit } =
        this.validatePaginationParams(page, limit);

      const paginationInputDTO: PaginationInputDTO = {
        page: validPage,
        limit: validLimit,
      };

      const result: Either<string, PaginatedDocumentsResponseDTO> =
        await this.paginationService.getPaginatedDocuments(paginationInputDTO);

      if (result instanceof Failure) {
        return res.status(400).json({ error: result.value });
      }

      const successResult = result as Ok<PaginatedDocumentsResponseDTO>;
      return res.status(200).json(successResult.value);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to fetch paginated documents",
      });
    }
  };

  public getPaginatedUsers = async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "10" } = req.query as {
        page: string;
        limit: string;
      };
      const { page: validPage, limit: validLimit } =
        this.validatePaginationParams(page, limit);

      const paginationInputDTO: PaginationInputDTO = {
        page: validPage,
        limit: validLimit,
      };

      const result: Either<string, PaginatedUsersResponseDTO> =
        await this.paginationService.getPaginatedUsers(paginationInputDTO);

      if (result instanceof Failure) {
        return res.status(400).json({ error: result.value });
      }

      const successResult = result as Ok<PaginatedUsersResponseDTO>;
      return res.status(200).json(successResult.value);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to fetch paginated users",
      });
    }
  };
}
