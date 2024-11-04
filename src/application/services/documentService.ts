// src/application/services/documentService.ts
import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";
import { DocumentFactory } from "../../domain/factories/documentFactory";
import { Logger } from "../../infrastructure/logging/logger";
import { Document } from "../../domain/entities/Document";
import { Either, failure, ok } from "../../utils/monads";
import { v4 as uuidv4 } from "uuid";
import { UploadDocumentDTO } from "../DTOs/document.dto";

export class DocumentService {
  private _documentRepository!: IDocumentRepository;
  private _logger!: Logger;

  set documentRepository(repository: IDocumentRepository) {
    this._documentRepository = repository;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  async createDocument(
    userId: string,
    fileName: string,
    fileExtension: string,
    contentType: string,
    tags: string[] = []
  ): Promise<Document> {
    this._logger.log(`Creating new document: ${fileName}.${fileExtension}`);

    const newDocument = DocumentFactory.createDocument(
      uuidv4(),
      fileName,
      fileExtension,
      contentType,
      tags
    );

    try {
      const insertedDocument = await this._documentRepository.createDocument(
        newDocument
      );
      if (!insertedDocument) {
        throw new Error("Failed to create document");
      }

      await this._documentRepository.assignOwnerPermission(
        insertedDocument.getId(),
        userId
      );
      this._logger.log(`Document created successfully for user: ${userId}`);
      return insertedDocument;
    } catch (error: any) {
      this._logger.error(`Error creating document: ${error.message}`);
      throw new Error("Error creating document");
    }
  }

  async getDocument(documentId: string): Promise<Either<Error, Document>> {
    this._logger.log(`Fetching document with ID: ${documentId}`);
    const document = await this._documentRepository.findDocumentById(
      documentId
    );

    if (!document) {
      this._logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    this._logger.log(`Document retrieved successfully with ID: ${documentId}`);
    return ok(document);
  }

  async deleteDocument(
    documentId: string
  ): Promise<Either<Error, Document | null>> {
    this._logger.log(`Deleting document with ID: ${documentId}`);
    const documentToDelete = await this._documentRepository.findDocumentById(
      documentId
    );

    if (!documentToDelete) {
      this._logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    await this._documentRepository.deleteDocument(documentId);
    this._logger.log(`Document deleted successfully with ID: ${documentId}`);
    return ok(documentToDelete);
  }

  async updateDocument(
    documentId: string,
    updates: Partial<{
      fileName: string;
      fileExtension: string;
      contentType: string;
      tags: string[];
      filePath: string;
    }>
  ): Promise<Either<Error, Document>> {
    this._logger.log(`Updating document with ID: ${documentId}`);
    const document = await this._documentRepository.findDocumentById(
      documentId
    );

    if (!document) {
      this._logger.error(`Document not found with ID: ${documentId}`);
      return failure(new Error("Document not found"));
    }

    try {
      if (updates.fileName) document.updateFileName(updates.fileName);
      if (updates.fileExtension)
        document.updateFileExtension(updates.fileExtension);
      if (updates.contentType) document.updateContentType(updates.contentType);
      if (updates.tags) document.updateTags(updates.tags);
      if (updates.filePath) document.setFilePath(updates.filePath);

      const updatedDocument = await this._documentRepository.updateDocument(
        documentId,
        {
          fileName: document.getFileName(),
          fileExtension: document.getFileExtension(),
          contentType: document.getContentType(),
          tags: document.getTags(),
          filePath: document.getFilePath(),
        }
      );

      if (!updatedDocument) {
        return failure(new Error("Failed to update document"));
      }

      return ok(updatedDocument);
    } catch (error: any) {
      this._logger.error(`Error updating document: ${error.message}`);
      return failure(new Error("Error updating document"));
    }
  }

  async uploadDocument(
    dto: UploadDocumentDTO
  ): Promise<Either<Error, Document>> {
    const {
      fileName,
      fileExtension,
      contentType,
      tags,
      userId,
      documentId,
      filePath,
    } = dto;

    this._logger.log(`Uploading document: ${fileName}`);
    const document = await this._documentRepository.findDocumentById(
      documentId
    );

    if (!document) {
      return failure(new Error("Document not found for uploading"));
    }

    document.setFilePath(filePath);

    const updatedDocument = await this._documentRepository.updateDocument(
      documentId,
      {
        filePath: document.getFilePath(),
      }
    );

    if (!updatedDocument) {
      return failure(new Error("Failed to upload document"));
    }

    this._logger.log(`Document uploaded successfully for user ${userId}`);
    return ok(updatedDocument);
  }
}
