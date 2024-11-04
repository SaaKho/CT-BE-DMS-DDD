import express from "express";
import { authMiddleware, authorizeRole } from "../../middleware/authMiddleware";
import { TagController } from "../../controllers/tagController";

const router = express.Router();

// No need to instantiate TagController, directly use static methods
router.post("/addNewTag/:documentId", TagController.addNewTag);

router.put("/updateTag/:documentId", TagController.updateTag);

router.delete("/deleteTag/:documentId", TagController.deleteTag);

export default router;
