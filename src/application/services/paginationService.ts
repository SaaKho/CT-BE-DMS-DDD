// src/application/services/paginationService.ts

import { injectable, inject } from "inversify";
import { Logger } from "../../infrastructure/logging/logger";
import { DocumentMapper } from "../mappers/documentMapper";
import { UserMapper } from "../mappers/userMapper";
import { Either, ok, failure } from "../../utils/monads";
import { PaginationInputDTO } from "../DTOs/requests/pagination.dto";
import {
  PaginatedDocumentsResponseDTO,
  PaginatedUsersResponseDTO,
} from "../DTOs/responses/paginationResponse.dto";
import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";

@injectable()
export class PaginationService {
  constructor(
    @inject("Logger") private readonly _logger: Logger,
    @inject("IDocumentRepository")
    private readonly documentRepository: IDocumentRepository,
    @inject("IUserRepository") private readonly userRepository: IUserRepository
  ) {}

  async getPaginatedDocuments(
    dto: PaginationInputDTO
  ): Promise<Either<string, PaginatedDocumentsResponseDTO>> {
    const { page, limit } = dto;
    this._logger.log(
      `Fetching paginated documents for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    try {
      const totalItems = await this.documentRepository.countDocuments();
      const paginatedData =
        await this.documentRepository.findPaginatedDocuments(limit, offset);

      const documentDTOs = paginatedData.map(DocumentMapper.toDTO);

      return ok({
        data: documentDTOs,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        message: "Documents retrieved successfully",
      });
    } catch (error: any) {
      this._logger.error(
        `Error fetching paginated documents: ${error.message}`
      );
      return failure("Failed to fetch paginated documents");
    }
  }

  async getPaginatedUsers(
    dto: PaginationInputDTO
  ): Promise<Either<string, PaginatedUsersResponseDTO>> {
    const { page, limit } = dto;
    this._logger.log(
      `Fetching paginated users for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    try {
      const totalItems = await this.userRepository.countUsers();
      const paginatedData = await this.userRepository.findPaginatedUsers(
        limit,
        offset
      );

      const userDTOs = paginatedData.map(UserMapper.toDTO);

      return ok({
        data: userDTOs,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        message: "Users retrieved successfully",
      });
    } catch (error: any) {
      this._logger.error(`Error fetching paginated users: ${error.message}`);
      return failure("Failed to fetch paginated users");
    }
  }
}
