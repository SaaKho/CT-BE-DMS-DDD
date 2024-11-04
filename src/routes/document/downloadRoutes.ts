import express from "express";
import { DownloadController } from "../../controllers/downloadController";

const router = express.Router();

// No need to instantiate DownloadController
router.post(
  "/generate-download-link/:filename",
  DownloadController.generateLink
);

router.get("/:token", DownloadController.downloadFile);

export default router;
