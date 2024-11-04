// src/application/services/DownloadService.ts
import { IDownloadRepository } from "../../domain/interfaces/Idownload.repository";
import { Logger } from "../../infrastructure/logging/logger";
import { DownloadLinkDTO, FilePathDTO } from "../DTOs/download.dto";
import { Either, failure, ok } from "../../utils/monads";

export class DownloadService {
  private _downloadRepository!: IDownloadRepository;
  private _logger!: Logger;

  set downloadRepository(repository: IDownloadRepository) {
    this._downloadRepository = repository;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  async generateDownloadLink(
    protocol: string,
    host: string,
    filename: string
  ): Promise<Either<Error, DownloadLinkDTO>> {
    if (!filename) {
      return failure(
        new Error("Filename is required to generate a download link.")
      );
    }

    this._logger.log(`Generating download link for file: ${filename}`);
    try {
      const downloadLink = await this._downloadRepository.generateDownloadLink(
        protocol,
        host,
        filename
      );
      return ok({ link: downloadLink }); // Return as DownloadLinkDTO
    } catch (error: any) {
      this._logger.error(`Failed to generate download link: ${error.message}`);
      return failure(new Error("Failed to generate download link."));
    }
  }

  async serveFileByToken(token: string): Promise<Either<Error, FilePathDTO>> {
    this._logger.log(`Serving file for token: ${token}`);
    try {
      const filePath = await this._downloadRepository.serveFileByToken(token);
      return ok({ path: filePath }); // Return as FilePathDTO
    } catch (error: any) {
      this._logger.error(
        `Error serving file for token: ${token} - ${error.message}`
      );
      return failure(new Error(error.message));
    }
  }
}
