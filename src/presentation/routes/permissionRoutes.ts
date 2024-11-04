// src/presentation/routes/permissionRoutes.ts
import { Router } from "express";
import { container } from "../../inversify/config";
import { AuthMiddleware } from "../../presentation/middleware/authMiddleware";
import { PermissionsController } from "../../presentation/controllers/permissionController";

const router = Router();
const authMiddleware = container.get<AuthMiddleware>("AuthMiddleware");
const permissionsController = container.get<PermissionsController>(
  "PermissionsController"
);

router.post(
  "/share/:documentId",
  authMiddleware.authenticate,
  permissionsController.shareDocument
);

export default router;
