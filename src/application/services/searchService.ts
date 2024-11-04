// src/application/services/SearchService.ts
import { ISearchRepository } from "../../domain/interfaces/Isearch.repository";
import { Logger } from "../../infrastructure/logging/logger";
import { DocumentMapper } from "../mappers/documentMapper";
import { SearchResultDTO } from "../DTOs/search.dto";
import { Either, ok, failure } from "../../utils/monads";

export class SearchService {
  private _searchRepository!: ISearchRepository;
  private _logger!: Logger;

  set searchRepository(repository: ISearchRepository) {
    this._searchRepository = repository;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  advancedSearch = async (
    tags: string[],
    fileName?: string,
    contentType?: string
  ): Promise<Either<string, SearchResultDTO>> => {
    this._logger.log(
      `Performing advanced search with: tags=${tags}, fileName=${fileName}, contentType=${contentType}`
    );

    try {
      const results = await this._searchRepository.advancedSearch(
        tags,
        fileName,
        contentType
      );

      if (results.length === 0) {
        this._logger.log(
          `No documents found for the specified search criteria.`
        );
        return failure("No documents match the search criteria");
      }

      this._logger.log(`Search returned ${results.length} results`);

      // Map results to DocumentDTO
      const documentDTOs = results.map(DocumentMapper.toDTO);

      return ok({
        results: documentDTOs,
        totalResults: results.length,
      });
    } catch (error: any) {
      this._logger.error(`Error during advanced search: ${error.message}`);
      return failure("Failed to perform advanced search");
    }
  };
}
