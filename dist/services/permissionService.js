"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
class PermissionsService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async shareDocumentWithUser(dto) {
        const { documentId, email, permissionType } = dto;
        const targetUser = await this.permissionRepository.findUserByEmail(email);
        if (!targetUser) {
            throw new Error("User with this email does not exist.");
        }
        const permissionExists = await this.permissionRepository.findUserByEmail(targetUser.id);
        if (!permissionExists) {
            await this.permissionRepository.sharePermission(documentId, targetUser.id, permissionType);
        }
        else {
            await this.permissionRepository.updatePermission(documentId, targetUser.id, permissionType);
        }
        return `Document shared as ${permissionType} with ${email}`;
    }
}
exports.PermissionsService = PermissionsService;
