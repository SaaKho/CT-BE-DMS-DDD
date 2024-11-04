// src/application/DTOs/responses/paginationResponse.dto.ts
import { DocumentDTO } from "../requests/document.dto";
import { UserDTO } from "../requests/user.dto";

// Response DTO for paginated documents
export interface PaginatedDocumentsResponseDTO {
  data: DocumentDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  message: string; // Optional success message
}

// Response DTO for paginated users
export interface PaginatedUsersResponseDTO {
  data: UserDTO[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  message: string; // Optional success message
}
