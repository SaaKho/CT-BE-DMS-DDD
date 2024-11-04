// src/routes/paginationRoutes.ts
import express from "express";
import { container } from "../../inversify/config";
import { PaginationController } from "../../presentation/controllers/paginationController";

const router = express.Router();

// Resolve PaginationController using DI
const paginationController = container.get<PaginationController>(
  "PaginationController"
);

// Routes
router.get("/documents", paginationController.getPaginatedDocuments);
router.get("/users", paginationController.getPaginatedUsers);

export default router;
