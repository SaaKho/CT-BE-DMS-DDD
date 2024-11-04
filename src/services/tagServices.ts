import { db, documents } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const addTagToDocument = async (documentId: string, name: string) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .execute();

  if (document.length === 0) {
    throw new Error("Document not found");
  }

  const existingTags = document[0].tags || [];

  if (existingTags.includes(name)) {
    throw new Error("Tag with the same name already exists");
  }

  existingTags.push(name);

  const updatedDocument = await db
    .update(documents)
    .set({ tags: existingTags })
    .where(eq(documents.id, documentId))
    .returning();
  return updatedDocument[0];
};

export const updateTagInDocument = async (
  documentId: string,
  oldName: string,
  newName: string
) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .execute();

  if (document.length === 0) {
    throw new Error("Document not found");
  }

  const existingTags = document[0].tags || [];
  const tagIndex = existingTags.indexOf(oldName);

  if (tagIndex === -1) {
    throw new Error("Tag not found");
  }

  existingTags[tagIndex] = newName;

  const updatedDocument = await db
    .update(documents)
    .set({ tags: existingTags })
    .where(eq(documents.id, documentId))
    .returning();
  return updatedDocument[0];
};

export const deleteTagFromDocument = async (
  documentId: string,
  name: string
) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .execute();

  if (document.length === 0) {
    throw new Error("Document not found");
  }

  const existingTags = document[0].tags || [];
  const tagIndex = existingTags.indexOf(name);

  if (tagIndex === -1) {
    throw new Error("Tag not found");
  }

  existingTags.splice(tagIndex, 1);

  const updatedDocument = await db
    .update(documents)
    .set({ tags: existingTags })
    .where(eq(documents.id, documentId))
    .returning();
  return updatedDocument[0];
};
