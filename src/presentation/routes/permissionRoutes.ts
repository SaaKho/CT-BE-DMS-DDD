// src/routes/permissionRoutes.ts
import { Router } from "express";
import { AuthMiddleware } from "../../presentation/middleware/authMiddleware";
import { sharePermissionMiddleware } from "../../presentation/middleware/sharePermissionMiddleware";
import { PermissionsController } from "../../presentation/controllers/permissionController";
import { PermissionsService } from "../../domain/services/permissionService";
import { PermissionRepository } from "../../infrastructure/repository/permissionRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";
import { JwtAuthHandler } from "../../infrastructure/auth/handlers/JWTAuthHandler";
import { UserRepository } from "../../infrastructure/repository/userRepository";

// Initialize repository, logger, and service
const permissionRepository = new PermissionRepository();
const logger = new ConsoleLogger();
const permissionService = new PermissionsService();
const userRepository = new UserRepository();
const authHandler = new JwtAuthHandler(userRepository);

// Property injection
permissionService.permissionRepository = permissionRepository;
permissionService.logger = logger;

// Inject the service into the controller
PermissionsController.setPermissionsService(permissionService);

// Instantiate the auth middleware with the auth handler
const authMiddleware = new AuthMiddleware(authHandler);

const router = Router();

// Route to share document permissions
router.post(
  "/share/:documentId",
  authMiddleware.authenticate,
  sharePermissionMiddleware,
  PermissionsController.shareDocument
);

export default router;
