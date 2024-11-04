// src/services/documentService.ts
import path from "path";
import fs from "fs";
import { db, documents } from "../drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// Service to get all documents
export const getAllDocuments = async () => {
  return await db.select().from(documents).execute();
};

// Service to get a document by ID
export const getDocumentById = async (id: string) => {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .execute();
};

// Service to create a new document
export const createDocument = async (
  fileName: string,
  fileExtension: string,
  contentType: string,
  tags: string[]
) => {
  const documentsDir = path.join(__dirname, "../../documents");
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }

  const fullFilePath = path.join(documentsDir, `${fileName}${fileExtension}`);
  fs.writeFileSync(fullFilePath, "", "utf8");

  const newDocument = await db
    .insert(documents)
    .values({
      id: uuidv4(),
      fileName,
      fileExtension,
      contentType,
      tags: tags,
    })
    .returning();

  return { newDocument, fullFilePath };
};

// Service to upload a document
export const uploadDocument = async (
  file: Express.Multer.File,
  tags: string[]
) => {
  const metadata = {
    fileName: path.parse(file.originalname).name,
    fileExtension: path.extname(file.originalname),
    contentType: file.mimetype,
    tags: tags ? tags : [],
  };

  const newDocument = await db.insert(documents).values(metadata).returning();

  const filePath = path.join(__dirname, "../../uploads", file.filename);

  return { newDocument, filePath };
};

// Service to delete a document by ID
export const deleteDocumentById = async (id: string) => {
  const existingDocument = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .execute();

  if (existingDocument.length === 0) {
    return null;
  }

  await db.delete(documents).where(eq(documents.id, id)).execute();

  const filePath = path.join(
    __dirname,
    "../../uploads",
    `${existingDocument[0].fileName}${existingDocument[0].fileExtension}`
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return existingDocument[0];
};
