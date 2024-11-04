"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const sharePermissionMiddleware_1 = require("../../middleware/sharePermissionMiddleware");
const permissionController_1 = require("../../controllers/permissionController");
const permissionService_1 = require("../../services/permissionService");
const permissionRepository_1 = require("../../repository/implementations/permissionRepository");
const permissionRepository = new permissionRepository_1.PermissionRepository();
const permissionService = new permissionService_1.PermissionsService(permissionRepository);
permissionController_1.PermissionsController.setPermissionsService(permissionService);
const router = (0, express_1.Router)();
router.post("/share/:documentId", authMiddleware_1.authMiddleware, sharePermissionMiddleware_1.sharePermissionMiddleware, permissionController_1.PermissionsController.shareDocument);
exports.default = router;