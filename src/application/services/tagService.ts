import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";
import { Logger } from "../../infrastructure/logging/logger";
import { Document } from "../../domain/entities/Document";
import { Either, ok, failure } from "../../utils/monads";
import { Tag } from "../../domain/valueObjects/Tag";
import { injectable, inject } from "inversify";

@injectable()
export class TagService {
  constructor(
    @inject("IDocumentRepository")
    private readonly documentRepository: IDocumentRepository,
    @inject("Logger") private readonly logger: Logger
  ) {}

  async addNewTag(
    documentId: string,
    tagName: string
  ): Promise<Either<string, Document>> {
    const tag = new Tag(tagName);
    this.logger.log(
      `Adding new tag '${tag.getName()}' to document: ${documentId}`
    );

    try {
      const updatedDocument = await this.documentRepository.addTag(
        documentId,
        tag.getName()
      );

      if (!updatedDocument) {
        this.logger.error(`Document not found for ID: ${documentId}`);
        return failure("Document not found");
      }

      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(`Error adding tag: ${error.message}`);
      return failure("Failed to add the tag to the document");
    }
  }

  async updateTag(
    documentId: string,
    oldTagName: string,
    newTagName: string
  ): Promise<Either<string, Document>> {
    const oldTag = new Tag(oldTagName);
    const newTag = new Tag(newTagName);
    this.logger.log(
      `Updating tag from '${oldTag.getName()}' to '${newTag.getName()}' on document: ${documentId}`
    );

    try {
      const updatedDocument = await this.documentRepository.updateTag(
        documentId,
        oldTag.getName(),
        newTag.getName()
      );

      if (!updatedDocument) {
        this.logger.error(`Document not found for ID: ${documentId}`);
        return failure("Document not found");
      }

      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(`Error updating tag: ${error.message}`);
      return failure("Failed to update the tag on the document");
    }
  }

  async deleteTag(
    documentId: string,
    tagName: string
  ): Promise<Either<string, Document>> {
    const tag = new Tag(tagName);
    this.logger.log(
      `Deleting tag '${tag.getName()}' from document: ${documentId}`
    );

    try {
      const updatedDocument = await this.documentRepository.deleteTag(
        documentId,
        tag.getName()
      );

      if (!updatedDocument) {
        this.logger.error(`Document not found for ID: ${documentId}`);
        return failure("Document not found");
      }

      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(`Error deleting tag: ${error.message}`);
      return failure("Failed to delete the tag from the document");
    }
  }
}
