// src/application/services/PaginationService.ts

import { IPaginationRepository } from "../../domain/interfaces/Ipagination.repository";
import { Logger } from "../../infrastructure/logging/logger";
import { DocumentMapper } from "../mappers/documentMapper";
import { UserMapper } from "../mappers/userMapper";
import { Either, ok, failure } from "../../utils/monads";
import { PaginatedDocumentsDTO } from "../DTOs/pagination.dto";
import { PaginatedUsersDTO } from "../DTOs/pagination.dto";

export class PaginationService {
  private _paginationRepository!: IPaginationRepository;
  private _logger!: Logger;

  set paginationRepository(repository: IPaginationRepository) {
    this._paginationRepository = repository;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  async getPaginatedDocuments(
    page: number,
    limit: number
  ): Promise<Either<string, PaginatedDocumentsDTO>> {
    this._logger.log(
      `Fetching paginated documents for page: ${page}, limit: ${limit}`
    );

    try {
      const paginatedData =
        await this._paginationRepository.getPaginatedDocuments(page, limit);

      // Convert entities to DTOs
      const documentDTOs = paginatedData.data.map(DocumentMapper.toDTO);

      return ok({
        data: documentDTOs,
        currentPage: page,
        totalPages: Math.ceil(paginatedData.totalItems / limit),
        totalItems: paginatedData.totalItems,
      });
    } catch (error: any) {
      this._logger.error(
        `Error fetching paginated documents: ${error.message}`
      );
      return failure("Failed to fetch paginated documents");
    }
  }

  async getPaginatedUsers(
    page: number,
    limit: number
  ): Promise<Either<string, PaginatedUsersDTO>> {
    this._logger.log(
      `Fetching paginated users for page: ${page}, limit: ${limit}`
    );

    try {
      const paginatedData = await this._paginationRepository.getPaginatedUsers(
        page,
        limit
      );

      // Convert entities to DTOs
      const userDTOs = paginatedData.data.map(UserMapper.toDTO);

      return ok({
        data: userDTOs,
        currentPage: page,
        totalPages: Math.ceil(paginatedData.totalItems / limit),
        totalItems: paginatedData.totalItems,
      });
    } catch (error: any) {
      this._logger.error(`Error fetching paginated users: ${error.message}`);
      return failure("Failed to fetch paginated users");
    }
  }
}
