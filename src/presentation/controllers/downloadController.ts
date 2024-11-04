// src/controllers/downloadController.ts
import { Request, Response } from "express";
import { DownloadService } from "../../application/services/downloadService";

export class DownloadController {
  private static downloadService: DownloadService;

  static setDownloadService(service: DownloadService) {
    DownloadController.downloadService = service;
  }

  static generateLink = async (req: Request, res: Response) => {
    const { filename } = req.params;

    const result =
      await DownloadController.downloadService.generateDownloadLink(
        req.protocol,
        req.get("host")!,
        filename
      );

    // Access properties with `as any` casting
    if ((result as any).error) {
      return res.status(400).json({ error: (result as any).error.message });
    }

    res.status(200).json({ downloadLink: (result as any).value.link });
  };

  static downloadFile = async (req: Request, res: Response) => {
    const { token } = req.params;

    const result = await DownloadController.downloadService.serveFileByToken(
      token
    );

    // Access properties with `as any` casting
    if ((result as any).error) {
      return res.status(400).json({ error: (result as any).error.message });
    }

    const filePath = (result as any).value.path;
    res.download(filePath, (downloadError) => {
      if (downloadError) {
        console.error(`Error downloading file: ${downloadError.message}`);
        res.status(500).json({ message: "Error downloading file." });
      }
    });
  };
}
