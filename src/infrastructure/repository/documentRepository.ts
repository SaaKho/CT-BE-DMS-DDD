// src/infrastructure/repository/implementations/documentRepository.ts

import {
  db,
  documents,
  permissions,
} from "../../infrastructure/drizzle/schema";
import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";
import { Document } from "../../domain/entities/Document";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { eq, ilike, arrayContains } from "drizzle-orm";
import { FileName } from "../../domain/valueObjects/filename.vo";
import { FileExtension } from "../../domain/valueObjects/fileExtension.vo";
import { ContentType } from "../../domain/valueObjects/contentType.vo";
import { FilePath } from "../../domain/valueObjects/filepath.vo";

@injectable()
export class DocumentRepository implements IDocumentRepository {
  async assignOwnerPermission(
    documentId: string,
    userId: string
  ): Promise<void> {
    await db
      .insert(permissions)
      .values({
        id: uuidv4(),
        documentId,
        userId,
        permissionType: "Owner",
      })
      .execute();
  }

  async findDocumentById(documentId: string): Promise<Document | null> {
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .execute();

    if (!document[0]) {
      return null;
    }

    const foundDocument = document[0];
    return new Document(
      foundDocument.id,
      new FileName(foundDocument.fileName),
      new FileExtension(foundDocument.fileExtension),
      new ContentType(foundDocument.contentType),
      foundDocument.tags || [],
      foundDocument.createdAt ? new Date(foundDocument.createdAt) : new Date(),
      foundDocument.updatedAt ? new Date(foundDocument.updatedAt) : new Date(),
      new FilePath(foundDocument.filePath || "")
    );
  }

  async create(documentData: Document): Promise<Document | null> {
    const newDocument = await db
      .insert(documents)
      .values({
        id: documentData.getId(),
        fileName: documentData.getFileName().getValue(),
        fileExtension: documentData.getFileExtension().getValue(),
        contentType: documentData.getContentType().getValue(),
        tags: documentData.getTags() || [],
        createdAt: documentData.getCreatedAt() || new Date(),
        updatedAt: documentData.getUpdatedAt() || new Date(),
        filePath: documentData.getFilePath().getValue(),
      })
      .returning()
      .execute();

    if (!newDocument[0]) {
      return null;
    }

    return new Document(
      newDocument[0].id,
      new FileName(newDocument[0].fileName),
      new FileExtension(newDocument[0].fileExtension),
      new ContentType(newDocument[0].contentType),
      newDocument[0].tags || [],
      newDocument[0].createdAt
        ? new Date(newDocument[0].createdAt)
        : new Date(),
      newDocument[0].updatedAt
        ? new Date(newDocument[0].updatedAt)
        : new Date(),
      new FilePath(newDocument[0].filePath || "")
    );
  }

  async update(
    documentId: string,
    updates: Partial<{
      fileName: string;
      fileExtension: string;
      contentType: string;
      tags: string[];
      filePath: string;
    }>
  ): Promise<Document | null> {
    const updatedDocument = await db
      .update(documents)
      .set({
        fileName: updates.fileName
          ? new FileName(updates.fileName).getValue()
          : undefined,
        fileExtension: updates.fileExtension
          ? new FileExtension(updates.fileExtension).getValue()
          : undefined,
        contentType: updates.contentType
          ? new ContentType(updates.contentType).getValue()
          : undefined,
        tags: updates.tags,
        filePath: updates.filePath
          ? new FilePath(updates.filePath).getValue()
          : undefined,
      })
      .where(eq(documents.id, documentId))
      .returning()
      .execute();

    if (!updatedDocument[0]) {
      return null;
    }

    return new Document(
      updatedDocument[0].id,
      new FileName(updatedDocument[0].fileName),
      new FileExtension(updatedDocument[0].fileExtension),
      new ContentType(updatedDocument[0].contentType),
      updatedDocument[0].tags || [],
      updatedDocument[0].createdAt
        ? new Date(updatedDocument[0].createdAt)
        : new Date(),
      updatedDocument[0].updatedAt
        ? new Date(updatedDocument[0].updatedAt)
        : new Date(),
      new FilePath(updatedDocument[0].filePath || "")
    );
  }

  async delete(documentId: string): Promise<Document | null> {
    const document = await this.findDocumentById(documentId);
    if (!document) {
      return null;
    }

    await db.delete(documents).where(eq(documents.id, documentId)).execute();
    return document;
  }

  async searchDocuments(
    tags: string[] = [],
    fileName?: string,
    contentType?: string
  ): Promise<Document[]> {
    let query: any = db.select().from(documents);

    if (tags.length > 0) {
      query = query.where(arrayContains(documents.tags as any, tags as any));
    }

    if (fileName) {
      query = query.where(ilike(documents.fileName, `%${fileName}%`));
    }

    if (contentType) {
      query = query.where(ilike(documents.contentType, `%${contentType}%`));
    }

    const results = await query.execute();
    return results.map(
      (result: any) =>
        new Document(
          result.id,
          new FileName(result.fileName),
          new FileExtension(result.fileExtension),
          new ContentType(result.contentType),
          result.tags || [],
          result.createdAt ? new Date(result.createdAt) : new Date(),
          result.updatedAt ? new Date(result.updatedAt) : new Date(),
          new FilePath(result.filePath || "")
        )
    );
  }
  async addTag(documentId: string, tagName: string): Promise<Document | null> {
    const document = await this.findDocumentById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.getTags().includes(tagName)) {
      throw new Error("Tag already exists");
    }

    document.updateTags([...document.getTags(), tagName]);
    return this.update(documentId, { tags: document.getTags() });
  }

  async updateTag(
    documentId: string,
    oldTagName: string,
    newTagName: string
  ): Promise<Document | null> {
    const document = await this.findDocumentById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const tags = document.getTags();
    const tagIndex = tags.indexOf(oldTagName);
    if (tagIndex === -1) {
      throw new Error("Tag not found");
    }

    tags[tagIndex] = newTagName;
    document.updateTags(tags);
    return this.update(documentId, { tags });
  }

  async deleteTag(
    documentId: string,
    tagName: string
  ): Promise<Document | null> {
    const document = await this.findDocumentById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const updatedTags = document.getTags().filter((tag) => tag !== tagName);
    document.updateTags(updatedTags);
    return this.update(documentId, { tags: updatedTags });
  }


  async findPaginatedDocuments(
    limit: number,
    offset: number
  ): Promise<Document[]> {
    const paginatedData = await db
      .select()
      .from(documents)
      .limit(limit)
      .offset(offset)
      .execute();

    return paginatedData.map(
      (doc) =>
        new Document(
          doc.id,
          new FileName(doc.fileName),
          new FileExtension(doc.fileExtension),
          new ContentType(doc.contentType),
          doc.tags || [],
          doc.createdAt || new Date(),
          doc.updatedAt || new Date(),
          new FilePath(doc.filePath || "")
        )
    );
  }

  async countDocuments(): Promise<number> {
    const totalItemsQuery = await db.select().from(documents);
    return totalItemsQuery.length;
  }
}
