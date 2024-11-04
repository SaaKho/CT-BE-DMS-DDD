"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharePermissionMiddleware = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const sharePermissionMiddleware = async (req, res, next) => {
    const { documentId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const permissionsResult = await schema_1.db
            .select()
            .from(schema_1.permissions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.permissions.documentId, documentId), (0, drizzle_orm_1.eq)(schema_1.permissions.userId, userId)))
            .execute();
        const userRole = permissionsResult[0]?.permissionType;
        if (!userRole || !["Owner", "Editor"].includes(userRole)) {
            return res.status(403).json({
                message: "Access denied. Only Owner or Editor can share the document.",
            });
        }
        next();
    }
    catch (error) {
        console.error("Error checking permissions:", error);
        return res.status(500).json({ message: "Server error." });
    }
};
exports.sharePermissionMiddleware = sharePermissionMiddleware;
