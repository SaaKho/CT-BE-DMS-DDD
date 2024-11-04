// src/presentation/routes/searchRoute.ts
import express from "express";
import { SearchController } from "../../presentation/controllers/searchController";
import { container } from "../../inversify/config"; // Import the Inversify container

const router = express.Router();

// Get the instance of the SearchController from the Inversify container
const searchController = container.get<SearchController>("SearchController");

// Route definition
router.get("/advancedSearch", searchController.advancedSearch);

export default router;
