// src/routes/searchRoutes.ts
import express from "express";
import { SearchController } from "../../presentation/controllers/searchController";
import { SearchService } from "../../application/services/searchService";
import { SearchRepository } from "../../infrastructure/repository/searchRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";

// Initialize repository, logger, and service
const searchRepository = new SearchRepository();
const logger = new ConsoleLogger();
const searchService = new SearchService();

// Property injection
searchService.searchRepository = searchRepository;
searchService.logger = logger;

// Set the service in the controller
SearchController.setSearchService(searchService);

const router = express.Router();

router.get("/advancedSearch", SearchController.advancedSearch);

export default router;
