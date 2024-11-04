import express, { Request, Response } from "express";
import {
  generateDownloadLink,
  getFilePathFromToken,
  copyFileToDownloads,
} from "../../services/downloadService";
import { authMiddleware, authorizeRole } from "../../middleware/authMiddleware";
import path from "path";

const router = express.Router();
router.use(authMiddleware);

// Generate a short-lived download link for a document file
router.post(
  "/generate-download-link/:filename",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { filename } = req.params;

    try {
      const token = generateDownloadLink(filename);

      const downloadLink = `${req.protocol}://${req.get(
        "host"
      )}/api/documents/download/${token}`;

      res.status(200).json({ downloadLink });
    } catch (error: any) {
      console.error("Error generating download link:", error);
      res.status(500).json({ error: "Failed to generate download link" });
    }
  }
);

// Serve the file using the token
router.get("/:token", async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const filePath = getFilePathFromToken(token);
    const downloadFilePath = copyFileToDownloads(
      filePath,
      path.basename(filePath)
    );

    res.download(downloadFilePath);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Download link has expired" });
    }
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

export default router;
