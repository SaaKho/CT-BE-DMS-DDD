"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.roleMiddleware = exports.authorizeRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const JWT_SECRET = process.env.JWT_SECRET || "carbonteq";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (req.user.role !== requiredRole) {
            return res
                .status(403)
                .json({ message: `Access denied. Requires ${requiredRole} role.` });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
const roleMiddleware = (requiredRoles) => {
    return async (req, res, next) => {
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
            console.log("Permissions result:", permissionsResult);
            const userRole = permissionsResult[0]?.permissionType;
            console.log("User Role:", userRole);
            if (!userRole) {
                return res
                    .status(403)
                    .json({ message: "Access denied. No permission for this document." });
            }
            if (requiredRoles.includes(userRole)) {
                return next();
            }
            return res
                .status(403)
                .json({ message: "Access denied. Insufficient permissions." });
        }
        catch (error) {
            console.error("Error fetching permissions:", error);
            return res.status(500).json({ message: "Server error." });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
exports.adminMiddleware = (0, exports.authorizeRole)("Admin");
