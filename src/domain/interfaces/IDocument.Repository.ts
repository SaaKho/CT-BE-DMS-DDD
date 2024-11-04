// src/repository/interfaces/IDocumentRepository.ts
import { Document } from "../../entities/Document";

export interface IDocumentRepository {
  findDocumentById(documentId: string): Promise<Document | null>;
  createDocument(documentData: Document): Promise<Document | null>;
  updateDocument(
    documentId: string,
    updates: Partial<{
      fileName: string;
      fileExtension: string;
      contentType: string;
      tags: string[];
      filePath: string;
    }>
  ): Promise<Document | null>;
  deleteDocument(documentId: string): Promise<Document | null>;
  assignOwnerPermission(documentId: string, userId: string): Promise<void>;
}
