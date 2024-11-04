// src/routes/downloadRoutes.ts
import express from "express";
import { DownloadController } from "../../presentation/controllers/downloadController";
import { DownloadService } from "../../application/services/downloadService";
import { DownloadRepository } from "../../infrastructure/repository/downloadRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";

const router = express.Router();

// Initialize repository, logger, and service
const downloadRepository = new DownloadRepository();
const logger = new ConsoleLogger();
const downloadService = new DownloadService();

// Property injection
downloadService.downloadRepository = downloadRepository;
downloadService.logger = logger;

// Inject the service into the controller
DownloadController.setDownloadService(downloadService);

router.post(
  "/generate-download-link/:filename",
  DownloadController.generateLink
);

router.get("/:token", DownloadController.downloadFile);

export default router;
