"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
class DocumentRepository {
    async assignOwnerPermission(documentId, userId) {
        await schema_1.db
            .insert(schema_1.permissions)
            .values({
            id: (0, uuid_1.v4)(),
            documentId,
            userId,
            permissionType: "Owner",
        })
            .execute();
    }
    async findDocumentById(documentId) {
        const document = await schema_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .execute();
        return document[0] || null;
    }
    async createDocument(documentData) {
        const id = (0, uuid_1.v4)();
        const newDocument = await schema_1.db
            .insert(schema_1.documents)
            .values({
            id,
            fileName: documentData.fileName,
            fileExtension: documentData.fileExtension,
            contentType: documentData.contentType,
            tags: documentData.tags,
        })
            .returning()
            .execute();
        return newDocument[0];
    }
    async updateDocument(documentId, updates) {
        const updatedDocument = await schema_1.db
            .update(schema_1.documents)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .returning()
            .execute();
        return updatedDocument[0] || null;
    }
    async deleteDocument(documentId) {
        const result = await schema_1.db
            .delete(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .execute();
        return result?.rowCount ? result.rowCount > 0 : false;
    }
    async uploadDocument(fileData, filePath) {
        const id = (0, uuid_1.v4)();
        const newDocument = await schema_1.db
            .insert(schema_1.documents)
            .values({
            id,
            fileName: fileData.fileName,
            fileExtension: fileData.fileExtension,
            contentType: fileData.contentType,
            tags: fileData.tags,
        })
            .returning()
            .execute();
        return newDocument[0];
    }
}
exports.DocumentRepository = DocumentRepository;
