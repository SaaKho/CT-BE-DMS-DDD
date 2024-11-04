// src/routes/tagRoutes.ts
import express from "express";
import { container } from "../../inversify/config";
import { TagController } from "../../presentation/controllers/tagController";

// Retrieve the TagController instance from the container
const tagController = container.get<TagController>("TagController");

const router = express.Router();

router.post("/addNewTag/:documentId", tagController.addNewTag);
router.put("/updateTag/:documentId", tagController.updateTag);
router.delete("/deleteTag/:documentId", tagController.deleteTag);

export default router;
