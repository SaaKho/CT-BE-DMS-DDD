// src/application/DTOs/responses/searchResponse.dto.ts
import { DocumentDTO } from "../requests/document.dto";

export interface SearchResultResponseDTO {
  documents: DocumentDTO[];
  totalResults: number;
  message: string; // Optional, for including a success message if needed
}
