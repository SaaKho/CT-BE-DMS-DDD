"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
class PermissionRepository {
    async sharePermission(documentId, userId, permissionType) {
        await schema_1.db
            .insert(schema_1.permissions)
            .values({
            id: (0, uuid_1.v4)(),
            documentId,
            userId,
            permissionType,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .execute();
    }
    async findUserByEmail(email) {
        const userResult = await schema_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .execute();
        return userResult[0] || null;
    }
    async updatePermission(documentId, userId, permissionType) {
        await schema_1.db
            .update(schema_1.permissions)
            .set({ permissionType, updated_at: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.permissions.documentId, documentId), (0, drizzle_orm_1.eq)(schema_1.permissions.userId, userId)))
            .execute();
    }
}
exports.PermissionRepository = PermissionRepository;
