// src/presentation/controllers/searchController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SearchService } from "../../application/services/searchService";
import { SearchCriteriaDTO } from "../../application/DTOs/requests/search.dto";
import { SearchResultResponseDTO } from "../../application/DTOs/responses/searchResponse.dto";
import { Either, Failure, Ok } from "../../utils/monads";

@injectable()
export class SearchController {
  constructor(
    @inject("SearchService") private readonly searchService: SearchService
  ) {}

  public advancedSearch = async (req: Request, res: Response) => {
    const { tags, fileName, contentType } = req.query;

    // Create the SearchCriteriaDTO object from query params
    const searchCriteria: SearchCriteriaDTO = {
      tags: (tags as string)?.split(",") || [],
      fileName: fileName as string,
      contentType: contentType as string,
    };

    try {
      const result: Either<string, SearchResultResponseDTO> =
        await this.searchService.advancedSearch(searchCriteria);

      // Handle failure explicitly
      if (result.isFailure()) {
        const failureResult = result as Failure<string>;
        return res.status(404).json({ error: failureResult.value });
      }

      // Handle success explicitly
      const successResult = result as Ok<SearchResultResponseDTO>;
      return res.status(200).json(successResult.value);
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to retrieve documents" });
    }
  };
}
