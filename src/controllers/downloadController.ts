// src/controllers/DownloadController.ts
import { Request, Response } from "express";
import { DownloadService } from "../services/downloadService";
import { Logger } from "../logging/logger"; // Import logger interface

export class DownloadController {
  private downloadService: DownloadService;
  private logger: Logger; // Add logger property

  constructor(downloadService: DownloadService, logger: Logger) {
    this.downloadService = downloadService;
    this.logger = logger; // Inject logger
  }

  generateLink = async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (!filename) {
      this.logger.error("Filename is required");
      return res.status(400).json({ error: "Filename is required" });
    }

    try {
      const downloadLink = this.downloadService.generateDownloadLink(
        filename,
        req.protocol,
        req.get("host")!
      );
      this.logger.log(`Download link generated for file: ${filename}`);
      res.status(200).json({ downloadLink });
    } catch (error: any) {
      this.logger.error(`Error generating download link: ${error.message}`);
      res.status(500).json({ error: "Failed to generate download link" });
    }
  };

  downloadFile = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      const downloadFilePath = this.downloadService.serveFileByToken(token);
      this.logger.log(`Downloading file with token: ${token}`);
      res.download(downloadFilePath, (err) => {
        if (err) {
          this.logger.error(`Error sending file: ${err.message}`);
          res.status(500).json({ error: "Failed to send file" });
        }
      });
    } catch (error: any) {
      this.logger.error(`Error downloading file: ${error.message}`);
      if (error.message === "File not found") {
        return res.status(404).json({ error: error.message });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Download link has expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ error: "Invalid download token" });
      }
      res.status(500).json({ error: "Failed to download file" });
    }
  };
}
