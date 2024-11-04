"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRepository = void 0;
const schema_1 = require("../../drizzle/schema");
class PaginationRepository {
    async getPaginatedDocuments(page, limit) {
        const offset = (page - 1) * limit;
        const totalItemsQuery = await schema_1.db.select().from(schema_1.documents);
        const totalItems = totalItemsQuery.length;
        const paginatedData = await schema_1.db
            .select()
            .from(schema_1.documents)
            .limit(limit)
            .offset(offset)
            .execute();
        return {
            data: paginatedData,
            totalItems,
        };
    }
    async getPaginatedUsers(page, limit) {
        const offset = (page - 1) * limit;
        const totalItemsQuery = await schema_1.db.select().from(schema_1.users);
        const totalItems = totalItemsQuery.length;
        const paginatedData = await schema_1.db
            .select()
            .from(schema_1.users)
            .limit(limit)
            .offset(offset)
            .execute();
        return {
            data: paginatedData,
            totalItems,
        };
    }
}
exports.PaginationRepository = PaginationRepository;
