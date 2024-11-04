"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityFactory = void 0;
const Document_1 = require("../entities/Document");
const Permission_1 = require("../entities/Permission");
class EntityFactory {
    static createDocument(id, fileName, fileExtension, contentType, tags) {
        return new Document_1.Document(id, fileName, fileExtension, contentType, tags, new Date(), new Date());
    }
    static createUser(username, email, password, role) {
        return {
            username,
            email,
            password,
            role,
        };
    }
    static createExistingUser(id, username, email, password, role) {
        return {
            username,
            email,
            password,
            role,
        };
    }
    static createPermission(userId, documentId, permissionType) {
        return new Permission_1.Permission(userId, documentId, permissionType);
    }
}
exports.EntityFactory = EntityFactory;
