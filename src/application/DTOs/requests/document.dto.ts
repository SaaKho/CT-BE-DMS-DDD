// src/application/dtos/DocumentDTO.ts
export interface DocumentDTO {
  id: string;
  fileName: string;
  fileExtension: string;
  contentType: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  filePath: string;
}

export interface CreateDocumentDTO {
  userId: string;
  fileName: string;
  fileExtension: string;
  contentType: string;
  tags?: string[];
}

export interface UpdateDocumentDTO {
  fileName?: string;
  fileExtension?: string;
  contentType?: string;
  tags?: string[];
  filePath?: string;
}

export interface UploadDocumentDTO {
  fileName: string;
  fileExtension: string;
  contentType: string;
  tags: string[];
  userId: string;
  documentId: string;
  filePath: string;
}
