// src/application/services/TagService.ts
import { ITagRepository } from "../../domain/interfaces/Itag.repository";
import { Document } from "../entities/Document";
import { Logger } from "../../infrastructure/logging/logger";
import { Either, ok, failure } from "../../utils/monads";
import { Tag } from "../../domain/valueObjects/Tag";

export class TagService {
  public tagRepository!: ITagRepository; // Property injection for the repository
  public logger!: Logger; // Property injection for the logger

  async addNewTag(
    documentId: string,
    tagName: string
  ): Promise<Either<string, Document>> {
    const tag = new Tag(tagName);
    this.logger.log(
      `Adding new tag '${tag.getName()}' to document: ${documentId}`
    );
    try {
      const updatedDocument = await this.tagRepository.addTag(documentId, tag);
      this.logger.log(
        `Tag '${tag.getName()}' added successfully to document: ${documentId}`
      );
      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(
        `Error adding tag '${tag.getName()}' to document: ${error.message}`
      );
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
      const updatedDocument = await this.tagRepository.updateTag(
        documentId,
        oldTag,
        newTag
      );
      this.logger.log(
        `Tag updated successfully from '${oldTag.getName()}' to '${newTag.getName()}' on document: ${documentId}`
      );
      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(`Error updating tag on document: ${error.message}`);
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
      const updatedDocument = await this.tagRepository.deleteTag(
        documentId,
        tag
      );
      this.logger.log(
        `Tag '${tag.getName()}' deleted successfully from document: ${documentId}`
      );
      return ok(updatedDocument);
    } catch (error: any) {
      this.logger.error(
        `Error deleting tag '${tag.getName()}' from document: ${error.message}`
      );
      return failure("Failed to delete the tag from the document");
    }
  }
}
