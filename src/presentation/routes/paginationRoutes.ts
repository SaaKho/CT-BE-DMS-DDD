// src/routes/paginationRoutes.ts
import express from "express";
import { PaginationController } from "../../presentation/controllers/paginationController";
import { PaginationService } from "../../application/services/paginationService";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";
import { PaginationRepository } from "../../infrastructure/repository/paginationRepository";

const router = express.Router();

// Initialize repository, logger, and service
const paginationRepository = new PaginationRepository();
const logger = new ConsoleLogger();
const paginationService = new PaginationService();

// Property injection
paginationService.paginationRepository = paginationRepository;
paginationService.logger = logger;

// Inject the service into the controller
PaginationController.setPaginationService(paginationService);

// Routes
router.get("/documents", PaginationController.getPaginatedDocuments);
router.get("/users", PaginationController.getPaginatedUsers);

export default router;
