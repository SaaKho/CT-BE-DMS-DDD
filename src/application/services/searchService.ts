// src/application/services/SearchService.ts

import { injectable, inject } from "inversify";
import { Logger } from "../../infrastructure/logging/logger";
import { IDocumentRepository } from "src/domain/interfaces/IDocument.Repository";
import { DocumentMapper } from "../mappers/documentMapper";
import { SearchCriteriaDTO } from "../DTOs/requests/search.dto";
import { SearchResultResponseDTO } from "../DTOs/responses/searchResponse.dto";
import { Either, ok, failure } from "../../utils/monads";

@injectable()
export class SearchService {
  constructor(
    @inject("IDocumentRepository")
    private readonly documentRepository: IDocumentRepository,
    @inject("Logger") private readonly logger: Logger
  ) {}

  async advancedSearch(
    criteria: SearchCriteriaDTO
  ): Promise<Either<string, SearchResultResponseDTO>> {
    const { tags, fileName, contentType } = criteria;

    this.logger.log(
      `Performing advanced search with: tags=${tags}, fileName=${fileName}, contentType=${contentType}`
    );

    try {
      // Perform the search in the document repository
      const documents = await this.documentRepository.searchDocuments(
        tags,
        fileName,
        contentType
      );

      // Check if any documents were found
      if (documents.length === 0) {
        this.logger.log("No documents found for the specified search criteria.");
        return failure("No documents match the search criteria");
      }

      // Map the documents to DTOs using the DocumentMapper
      const documentDTOs = documents.map(DocumentMapper.toDTO);

      // Create the response DTO
      const response: SearchResultResponseDTO = {
        documents: documentDTOs,
        totalResults: documents.length,
        message: "Documents retrieved successfully"
      };

      // Return a successful response
      return ok(response);
    } catch (error: any) {
      // Log the error and return a failure
      this.logger.error(`Error during advanced search: ${error.message}`);
      return failure("Failed to perform advanced search");
    }
  }
}
