// src/routes/tagRoutes.ts
import express from "express";
import { TagController } from "../../presentation/controllers/tagController";
import { TagService } from "../../domain/services/tagService";
import { TagRepository } from "../../infrastructure/repository/tagRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";

const router = express.Router();

// Initialize instances
const tagRepository = new TagRepository();
const logger = new ConsoleLogger();
const tagService = new TagService();

// Set up property injection
tagService.tagRepository = tagRepository;
tagService.logger = logger;

// Assign the service to the controller
TagController.setTagService(tagService);

router.post("/addNewTag/:documentId", TagController.addNewTag);
router.put("/updateTag/:documentId", TagController.updateTag);
router.delete("/deleteTag/:documentId", TagController.deleteTag);

export default router;
