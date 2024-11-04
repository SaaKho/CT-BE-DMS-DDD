// src/repository/implementations/tagRepository.ts
import { db, documents } from "../drizzle/schema";
import { ITagRepository } from "../../domain/interfaces/Itag.repository";
import { eq } from "drizzle-orm";
import { Document } from "../../domain/entities/Document";
import { Tag } from "../../domain/valueObjects/Tag";

export class TagRepository implements ITagRepository {
  async addTag(documentId: string, tag: Tag): Promise<Document> {
    const documentData = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .execute();

    if (documentData.length === 0) {
      throw new Error("Document not found");
    }

    const existingTags = documentData[0].tags || [];
    if (existingTags.includes(tag.getName())) {
      throw new Error("Tag already exists.");
    }

    existingTags.push(tag.getName());

    const updatedDocument = await db
      .update(documents)
      .set({ tags: existingTags })
      .where(eq(documents.id, documentId))
      .returning()
      .execute();

    return new Document(
      updatedDocument[0].id,
      updatedDocument[0].fileName,
      updatedDocument[0].fileExtension,
      updatedDocument[0].contentType,
      updatedDocument[0].tags || [],
      updatedDocument[0].createdAt
        ? new Date(updatedDocument[0].createdAt)
        : new Date(),
      updatedDocument[0].updatedAt
        ? new Date(updatedDocument[0].updatedAt)
        : new Date()
    );
  }

  async updateTag(
    documentId: string,
    oldTag: Tag,
    newTag: Tag
  ): Promise<Document> {
    const documentData = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .execute();

    if (documentData.length === 0) {
      throw new Error("Document not found");
    }

    const existingTags = documentData[0].tags || [];
    const tagIndex = existingTags.indexOf(oldTag.getName());

    if (tagIndex === -1) {
      throw new Error("Tag not found.");
    }

    existingTags[tagIndex] = newTag.getName();

    const updatedDocument = await db
      .update(documents)
      .set({ tags: existingTags })
      .where(eq(documents.id, documentId))
      .returning()
      .execute();

    return new Document(
      updatedDocument[0].id,
      updatedDocument[0].fileName,
      updatedDocument[0].fileExtension,
      updatedDocument[0].contentType,
      updatedDocument[0].tags || [],
      updatedDocument[0].createdAt
        ? new Date(updatedDocument[0].createdAt)
        : new Date(),
      updatedDocument[0].updatedAt
        ? new Date(updatedDocument[0].updatedAt)
        : new Date()
    );
  }

  async deleteTag(documentId: string, tag: Tag): Promise<Document> {
    const documentData = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .execute();

    if (documentData.length === 0) {
      throw new Error("Document not found");
    }

    const existingTags = documentData[0].tags || [];
    const tagIndex = existingTags.indexOf(tag.getName());

    if (tagIndex === -1) {
      throw new Error("Tag not found.");
    }

    existingTags.splice(tagIndex, 1);

    const updatedDocument = await db
      .update(documents)
      .set({ tags: existingTags })
      .where(eq(documents.id, documentId))
      .returning()
      .execute();

    return new Document(
      updatedDocument[0].id,
      updatedDocument[0].fileName,
      updatedDocument[0].fileExtension,
      updatedDocument[0].contentType,
      updatedDocument[0].tags || [],
      updatedDocument[0].createdAt
        ? new Date(updatedDocument[0].createdAt)
        : new Date(),
      updatedDocument[0].updatedAt
        ? new Date(updatedDocument[0].updatedAt)
        : new Date()
    );
  }
}
