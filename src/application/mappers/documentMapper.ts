// src/application/mappers/DocumentMapper.ts

import { Document } from "../../domain/entities/Document";
import { DocumentDTO } from "../DTOs/requests/document.dto";
import { FileName } from "../../domain/valueObjects/filename.vo";
import { FileExtension } from "../../domain/valueObjects/fileExtension.vo";
import { ContentType } from "../../domain/valueObjects/contentType.vo";
import { FilePath } from "../../domain/valueObjects/filepath.vo";

export class DocumentMapper {
  // Convert Document entity to DocumentDTO
  static toDTO(document: Document): DocumentDTO {
    return {
      id: document.getId(),
      fileName: document.getFileName().getValue(),
      fileExtension: document.getFileExtension().getValue(),
      contentType: document.getContentType().getValue(),
      tags: document.getTags(),
      createdAt: document.getCreatedAt(),
      updatedAt: document.getUpdatedAt(),
      filePath: document.getFilePath().getValue(),
    };
  }

  // Convert DocumentDTO to Document entity
  static fromDTO(dto: DocumentDTO): Document {
    return new Document(
      dto.id,
      new FileName(dto.fileName),
      new FileExtension(dto.fileExtension),
      new ContentType(dto.contentType),
      dto.tags,
      dto.createdAt,
      dto.updatedAt,
      new FilePath(dto.filePath)
    );
  }
}
