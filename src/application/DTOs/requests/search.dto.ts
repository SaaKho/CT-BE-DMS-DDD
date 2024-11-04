// src/application/DTOs/requests/search.dto.ts
import { DocumentDTO } from "./document.dto";
export interface SearchCriteriaDTO {
  tags: string[];
  fileName?: string;
  contentType?: string;
}

export interface SearchResultDTO {
  results: DocumentDTO[];
  totalResults: number;
}
