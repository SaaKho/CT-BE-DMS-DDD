"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
class Permission {
    constructor(userId, documentId, permissionType) {
        this.userId = userId;
        this.documentId = documentId;
        this.permissionType = permissionType;
    }
}
exports.Permission = Permission;
