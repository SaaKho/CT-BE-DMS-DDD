// src/application/mappers/DocumentMapper.ts
import { Document } from "../../domain/entities/Document";
import { DocumentDTO } from "../DTOs/document.dto";

export class DocumentMapper {
  // Convert Document entity to DocumentDTO
  static toDTO(document: Document): DocumentDTO {
    return {
      id: document.getId(),
      fileName: document.getFileName(),
      fileExtension: document.getFileExtension(),
      contentType: document.getContentType(),
      tags: document.getTags(),
      createdAt: document.getCreatedAt(),
      updatedAt: document.getUpdatedAt(),
      filePath: document.getFilePath(),
    };
  }

  // Convert DocumentDTO to Document entity
  static fromDTO(dto: DocumentDTO): Document {
    return new Document(
      dto.id,
      dto.fileName,
      dto.fileExtension,
      dto.contentType,
      dto.tags,
      dto.createdAt,
      dto.updatedAt,
      dto.filePath
    );
  }
}
