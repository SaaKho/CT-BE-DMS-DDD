// src/factories/DocumentFactory.ts

import { Document } from "../entities/Document";
import { FileName } from "../valueObjects/filename.vo";
import { FileExtension } from "../valueObjects/fileExtension.vo";
import { ContentType } from "../valueObjects/contentType.vo";
import { FilePath } from "../valueObjects/filepath.vo";

export class DocumentFactory {
  static createDocument(
    id: string,
    fileName: string,
    fileExtension: string,
    contentType: string,
    tags: string[] = [],
    filePath: string = ""
  ): Document {
    return new Document(
      id,
      new FileName(fileName),
      new FileExtension(fileExtension),
      new ContentType(contentType),
      tags,
      new Date(),
      new Date(),
      new FilePath(filePath)
    );
  }

  static createExistingDocument(
    id: string,
    fileName: string,
    fileExtension: string,
    contentType: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
    filePath: string
  ): Document {
    return new Document(
      id,
      new FileName(fileName),
      new FileExtension(fileExtension),
      new ContentType(contentType),
      tags,
      createdAt,
      updatedAt,
      new FilePath(filePath)
    );
  }
}
