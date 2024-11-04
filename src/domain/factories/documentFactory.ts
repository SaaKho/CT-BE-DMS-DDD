// src/factories/DocumentFactory.ts
import { Document } from "../entities/Document";

export class DocumentFactory {
  static createDocument(
    id: string,
    fileName: string,
    fileExtension: string,
    contentType: string,
    tags: string[] = []
  ): Document {
    return new Document(id, fileName, fileExtension, contentType, tags);
  }
}
