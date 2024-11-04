import { Document } from "../../domain/entities/Document";

export interface IDocumentRepository {
  findDocumentById(documentId: string): Promise<Document | null>;
  create(documentData: Document): Promise<Document | null>;
  update(
    documentId: string,
    updates: Partial<{
      fileName: string;
      fileExtension: string;
      contentType: string;
      tags: string[];
      filePath: string;
    }>
  ): Promise<Document | null>;
  delete(documentId: string): Promise<Document | null>;
  assignOwnerPermission(documentId: string, userId: string): Promise<void>;

  // Tag-specific methods
  addTag(documentId: string, tagName: string): Promise<Document | null>;
  updateTag(
    documentId: string,
    oldTagName: string,
    newTagName: string
  ): Promise<Document | null>;
  deleteTag(documentId: string, tagName: string): Promise<Document | null>;

  //search specific method
  searchDocuments(
    tags?: string[],
    fileName?: string,
    contentType?: string
  ): Promise<Document[]>;
  findPaginatedDocuments(limit: number, offset: number): Promise<Document[]>;

  countDocuments(): Promise<number>;
}
