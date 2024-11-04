"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRepository = void 0;
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class SearchRepository {
    async advancedSearch(tags, fileName, contentType) {
        let query = schema_1.db.select().from(schema_1.documents);
        if (tags && tags.length > 0) {
            query = query.where((0, drizzle_orm_1.arrayContains)(schema_1.documents.tags, tags));
        }
        if (fileName) {
            query = query.where((0, drizzle_orm_1.ilike)(schema_1.documents.fileName, `%${fileName}%`));
        }
        if (contentType) {
            query = query.where((0, drizzle_orm_1.ilike)(schema_1.documents.contentType, `%${contentType}%`));
        }
        const results = await query.execute();
        return results;
    }
}
exports.SearchRepository = SearchRepository;
