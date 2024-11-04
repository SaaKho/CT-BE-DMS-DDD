"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class TagRepository {
    async addTag(documentId, tagName) {
        const document = await schema_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .execute();
        if (document.length === 0) {
            throw new Error("Document not found");
        }
        const existingTags = document[0].tags || [];
        if (existingTags.includes(tagName)) {
            throw new Error("Tag already exists.");
        }
        existingTags.push(tagName);
        const updatedDocument = await schema_1.db
            .update(schema_1.documents)
            .set({ tags: existingTags })
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .returning();
        return updatedDocument[0];
    }
    async updateTag(documentId, oldTagName, newTagName) {
        const document = await schema_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .execute();
        if (document.length === 0) {
            throw new Error("Document not found");
        }
        const existingTags = document[0].tags || [];
        const tagIndex = existingTags.indexOf(oldTagName);
        if (tagIndex === -1) {
            throw new Error("Tag not found.");
        }
        existingTags[tagIndex] = newTagName;
        const updatedDocument = await schema_1.db
            .update(schema_1.documents)
            .set({ tags: existingTags })
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .returning();
        return updatedDocument[0];
    }
    async deleteTag(documentId, tagName) {
        const document = await schema_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .execute();
        if (document.length === 0) {
            throw new Error("Document not found");
        }
        const existingTags = document[0].tags || [];
        const tagIndex = existingTags.indexOf(tagName);
        if (tagIndex === -1) {
            throw new Error("Tag not found.");
        }
        existingTags.splice(tagIndex, 1);
        const updatedDocument = await schema_1.db
            .update(schema_1.documents)
            .set({ tags: existingTags })
            .where((0, drizzle_orm_1.eq)(schema_1.documents.id, documentId))
            .returning();
        return updatedDocument[0];
    }
}
exports.TagRepository = TagRepository;
