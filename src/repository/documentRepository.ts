import { db, documents, permissions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Repository to get document by ID
export const findDocumentById = async (documentId: string) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .execute();

  return document[0]; // Return the document if found
};

// Repository to create a document
export const createDocument = async (documentData: {
  id: string;
  fileName: string;
  fileExtension: string;
  contentType: string;
  tags: string[];
}) => {
  await db.insert(documents).values(documentData).execute();
};

// Repository to update a document by ID
export const updateDocument = async (
  documentId: string,
  updates: Partial<{
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: string[];
  }>
) => {
  const updatedDocument = await db
    .update(documents)
    .set(updates)
    .where(eq(documents.id, documentId))
    .returning()
    .execute();

  return updatedDocument[0];
};

// Repository to delete a document by ID
export const deleteDocument = async (documentId: string) => {
  await db.delete(documents).where(eq(documents.id, documentId)).execute();
};

// Repository to assign a user as "Owner"
export const assignOwnerPermission = async (
  documentId: string,
  userId: string
) => {
  await db
    .insert(permissions)
    .values({
      id: uuidv4(),
      documentId: documentId,
      userId: userId,
      permissionType: "Owner", // Assign the user as Owner
    })
    .execute();
};
