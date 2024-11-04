// src/presentation/controllers/downloadController.ts

import { Request, Response } from "express";
import { DownloadService } from "../../application/services/downloadService";
import { DownloadLinkDTO } from "../../application/DTOs/requests/download.dto";
import {
  DownloadLinkResponseDTO,
  FilePathResponseDTO,
} from "../../application/DTOs/responses/downloadResponse.dto";
import { Either, Ok, Failure } from "../../utils/monads";
import { injectable } from "inversify";

@injectable()
export class DownloadController {
  private static downloadService: DownloadService;

  public static setDownloadService(service: DownloadService) {
    DownloadController.downloadService = service;
  }

  public static generateDownloadLink = async (req: Request, res: Response) => {
    const { protocol, hostname, body } = req;
    const { fileId } = body; // Use fileId instead of filename

    if (!fileId) {
      return res
        .status(400)
        .json({ error: "File ID is required to generate a download link." });
    }

    // Create a DTO with the necessary data
    const dto: DownloadLinkDTO = {
      protocol,
      host: hostname,
      fileId,
    };

    // Call the service method to generate the download link
    const result: Either<Error, DownloadLinkResponseDTO> =
      await DownloadController.downloadService.generateDownloadLink(dto);

    // Handle failure
    if (result instanceof Failure) {
      const error = result.value as Error;
      return res.status(400).json({ error: error.message });
    }

    // Handle success
    if (result instanceof Ok) {
      const downloadLinkResponse = result.value as DownloadLinkResponseDTO;
      return res.status(200).json(downloadLinkResponse);
    }

    return res.status(500).json({ message: "Unexpected error occurred." });
  };

  public static serveFileByToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ error: "Token is required to serve the file." });
    }

    const result: Either<Error, FilePathResponseDTO> =
      await DownloadController.downloadService.serveFileByToken(token);

    if (result instanceof Failure) {
      const error = result.value as Error;
      return res.status(400).json({ error: error.message });
    }

    if (result instanceof Ok) {
      const filePathResponse = result.value as FilePathResponseDTO;
      return res.download(filePathResponse.path, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error serving file." });
        }
      });
    }

    return res.status(500).json({ message: "Unexpected error occurred." });
  };
}
