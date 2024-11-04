// src/application/dtos/SearchResultDTO.ts
import { DocumentDTO } from "./document.dto";

export interface SearchResultDTO {
  results: DocumentDTO[];
  totalResults: number;
}
