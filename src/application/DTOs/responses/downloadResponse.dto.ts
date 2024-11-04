// src/application/DTOs/responses/downloadResponse.dto.ts

export interface DownloadLinkResponseDTO {
  link: string;
  message: string; // Optional success message
}

export interface FilePathResponseDTO {
  path: string;
  message: string; // Optional success message
}
