"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
class PermissionsController {
    static setPermissionsService(service) {
        _a.permissionService = service;
    }
}
exports.PermissionsController = PermissionsController;
_a = PermissionsController;
PermissionsController.shareDocument = async (req, res) => {
    const { documentId } = req.params;
    const { email, permissionType } = req.body;
    if (!email || !permissionType) {
        return res
            .status(400)
            .json({ message: "Email and permission type are required" });
    }
    const validPermissionTypes = ["Editor", "Viewer"];
    if (!validPermissionTypes.includes(permissionType)) {
        return res.status(400).json({
            message: `Invalid permission type. Must be one of: ${validPermissionTypes.join(", ")}`,
        });
    }
    try {
        const message = await _a.permissionService.shareDocumentWithUser({
            documentId,
            email,
            permissionType,
        });
        res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error sharing document:", error);
        return res.status(500).json({ message: "Server error." });
    }
};
