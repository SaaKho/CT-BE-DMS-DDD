import { db, documents, permissions } from "../drizzle/schema";
import { v4 as uuidv4 } from "uuid"; // For generating unique document IDs
import { eq } from "drizzle-orm"; // Import eq function

// Service to create a new document and assign the user as "Owner"
export const createDocumentService = async (
  userId: string,
  fileName: string,
  fileExtension: string,
  contentType: string,
  tags: string[]
) => {
  const newDocumentId = uuidv4(); // Generate a unique document ID

  // Insert the new document
  await db
    .insert(documents)
    .values({
      id: newDocumentId,
      fileName,
      fileExtension,
      contentType,
      tags,
    })
    .execute();

  // Assign the user as the "Owner" in the permissions table
  await db
    .insert(permissions)
    .values({
      id: uuidv4(),
      documentId: newDocumentId,
      userId: userId,
      permissionType: "Owner", // User is the owner of the document
    })
    .execute();

  return newDocumentId;
};

// Service to get a document by ID
export const getDocumentService = async (documentId: string) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId)) // Use eq function correctly
    .execute();

  return document[0]; // Return the document if found
};

// Service to update a document by ID (only Owner and Editor can update)
export const updateDocumentService = async (
  documentId: string,
  updates: Partial<{ fileName: string; fileExtension: string; contentType: string; tags: string[] }>
) => {
  const updatedDocument = await db
    .update(documents)
    .set(updates)
    .where(eq(documents.id, documentId)) // Use eq function correctly
    .returning()
    .execute();

  return updatedDocument[0];
};

// Service to delete a document by ID (only Owner or Admin can delete)
export const deleteDocumentService = async (documentId: string) => {
  await db
    .delete(documents)
    .where(eq(documents.id, documentId)) // Use eq function correctly
    .execute();
};
