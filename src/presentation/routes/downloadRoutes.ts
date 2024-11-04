import express from "express";
import { DownloadController } from "../controllers/downloadController";
import { container } from "../../inversify/config";
import { DownloadService } from "../../application/services/downloadService";
import { AuthMiddleware } from "../middleware/authMiddleware"; // Import AuthMiddleware

const router = express.Router();

// Get instances of the services
const downloadService = container.get<DownloadService>("DownloadService");
const authMiddleware = container.get<AuthMiddleware>("AuthMiddleware"); // Get AuthMiddleware

DownloadController.setDownloadService(downloadService);

// Define routes with authentication
router.post(
  "/link",
  authMiddleware.authenticate,
  DownloadController.generateDownloadLink
);
router.get(
  "/:token",
  authMiddleware.authenticate,
  DownloadController.serveFileByToken
);

export default router;
