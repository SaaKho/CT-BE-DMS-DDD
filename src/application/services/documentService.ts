// src/application/services/DocumentService.ts

import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";
import { injectable, inject } from "inversify";
import { Logger } from "../../infrastructure/logging/logger";
import { Document } from "../../domain/entities/Document";
import { Either, failure, ok } from "../../utils/monads";
import { v4 as uuidv4 } from "uuid";
import {
  CreateDocumentDTO,
  UpdateDocumentDTO,
  UploadDocumentDTO,
  DocumentDTO,
} from "../DTOs/requests/document.dto";
import { DocumentMapper } from "../mappers/documentMapper";
import { FileName } from "../../domain/valueObjects/filename.vo";
import { FileExtension } from "../../domain/valueObjects/fileExtension.vo";
import { ContentType } from "../../domain/valueObjects/contentType.vo";
import { FilePath } from "../../domain/valueObjects/filepath.vo";

@injectable()
export class DocumentService {
  constructor(
    @inject("IDocumentRepository")
    private readonly documentRepository: IDocumentRepository,
    @inject("Logger") private readonly logger: Logger
  ) {}

  // Create Document
  async createDocument(dto: CreateDocumentDTO): Promise<DocumentDTO> {
    const { userId, fileName, fileExtension, contentType, tags } = dto;
    this.logger.log(`Creating new document: ${fileName}.${fileExtension}`);

    const newDocument = new Document(
      uuidv4(),
      new FileName(fileName),
      new FileExtension(fileExtension),
      new ContentType(contentType),
      tags || [],
      new Date(),
      new Date(),
      new FilePath("") // Default empty path if not provided
    );

    try {
      const insertedDocument = await this.documentRepository.create(
        newDocument
      );
      if (!insertedDocument) {
        throw new Error("Failed to create document");
      }

      await this.documentRepository.assignOwnerPermission(
        insertedDocument.getId(),
        userId
      );
      this.logger.log(`Document created successfully for user: ${userId}`);

      // Use DocumentMapper to convert the entity to DTO
      return DocumentMapper.toDTO(insertedDocument);
    } catch (error: any) {
      this.logger.error(`Error creating document: ${error.message}`);
      throw new Error("Error creating document");
    }
  }

  // Get Document
  async getDocument(documentId: string): Promise<Either<Error, DocumentDTO>> {
    this.logger.log(`Fetching document with ID: ${documentId}`);
    const document = await this.documentRepository.findDocumentById(documentId);

    if (!document) {
      this.logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    this.logger.log(`Document retrieved successfully with ID: ${documentId}`);

    // Use DocumentMapper to convert the entity to DTO
    return ok(DocumentMapper.toDTO(document));
  }

  // Update Document
  async updateDocument(
    documentId: string,
    updates: UpdateDocumentDTO
  ): Promise<Either<Error, DocumentDTO>> {
    this.logger.log(`Updating document with ID: ${documentId}`);
    const document = await this.documentRepository.findDocumentById(documentId);

    if (!document) {
      this.logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    try {
      if (updates.fileName)
        document.updateFileName(new FileName(updates.fileName));
      if (updates.fileExtension)
        document.updateFileExtension(new FileExtension(updates.fileExtension));
      if (updates.contentType)
        document.updateContentType(new ContentType(updates.contentType));
      if (updates.tags) document.updateTags(updates.tags);
      if (updates.filePath)
        document.setFilePath(new FilePath(updates.filePath));

      const updatedDocument = await this.documentRepository.update(documentId, {
        fileName: document.getFileName().getValue(),
        fileExtension: document.getFileExtension().getValue(),
        contentType: document.getContentType().getValue(),
        tags: document.getTags(),
        filePath: document.getFilePath().getValue(),
      });

      if (!updatedDocument) {
        return failure(new Error("Failed to update document"));
      }

      // Use DocumentMapper to convert the entity to DTO
      return ok(DocumentMapper.toDTO(updatedDocument));
    } catch (error: any) {
      this.logger.error(`Error updating document: ${error.message}`);
      return failure(new Error("Error updating document"));
    }
  }

  // Delete Document
  async deleteDocument(
    documentId: string
  ): Promise<Either<Error, DocumentDTO | null>> {
    this.logger.log(`Deleting document with ID: ${documentId}`);
    const documentToDelete = await this.documentRepository.findDocumentById(
      documentId
    );

    if (!documentToDelete) {
      this.logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    await this.documentRepository.delete(documentId);
    this.logger.log(`Document deleted successfully with ID: ${documentId}`);

    // Use DocumentMapper to convert the entity to DTO
    return ok(DocumentMapper.toDTO(documentToDelete));
  }

  async uploadDocument(
    dto: UploadDocumentDTO
  ): Promise<Either<Error, DocumentDTO>> {
    const {
      fileName,
      fileExtension,
      contentType,
      tags,
      userId,
      documentId,
      filePath,
    } = dto;

    this.logger.log(
      `Starting upload for document: ${fileName} with ID: ${documentId}`
    );

    // Find the document by ID
    const document = await this.documentRepository.findDocumentById(documentId);
    if (!document) {
      this.logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found for uploading"));
    }

    // Set the filePath where the uploaded document is saved
    document.setFilePath(new FilePath(filePath));
    this.logger.log(`File path set to: ${filePath} for document: ${fileName}`);

    // Update the document with the new filePath
    const updatedDocument = await this.documentRepository.update(documentId, {
      filePath: document.getFilePath().getValue(),
    });

    if (!updatedDocument) {
      this.logger.error(
        `Failed to update filePath for document ID: ${documentId}`
      );
      return failure(new Error("Failed to upload document"));
    }

    this.logger.log(
      `Document uploaded successfully for user ${userId}, file path: ${filePath}`
    );

    // Use DocumentMapper to convert the entity to DTO
    return ok(DocumentMapper.toDTO(updatedDocument));
  }
}
