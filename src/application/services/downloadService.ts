// src/application/services/downloadService.ts

import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { Logger } from "../../infrastructure/logging/logger";
import { DownloadLinkDTO } from "../DTOs/requests/download.dto";
import {
  DownloadLinkResponseDTO,
  FilePathResponseDTO,
} from "../DTOs/responses/downloadResponse.dto";
import { Either, failure, ok } from "../../utils/monads";
import { IDocumentRepository } from "../../domain/interfaces/IDocument.Repository";

// Configuration variables
const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";
const LINK_EXPIRATION = process.env.LINK_EXPIRATION || "15m";

@injectable()
export class DownloadService {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("IDocumentRepository")
    private readonly documentRepository: IDocumentRepository
  ) {}

  // Generate download link by file ID
  async generateDownloadLink(
    dto: DownloadLinkDTO
  ): Promise<Either<Error, DownloadLinkResponseDTO>> {
    const { protocol, host, fileId } = dto;

    if (!fileId) {
      return failure(
        new Error("File ID is required to generate a download link.")
      );
    }

    // Fetch the file metadata from the database using the file ID
    const file = await this.documentRepository.findDocumentById(fileId);

    if (!file) {
      this.logger.error(`File with ID ${fileId} does not exist.`);
      return failure(new Error("File not found in DB."));
    }

    this.logger.log(`Generating download link for file ID: ${fileId}`);

    try {
      // Generate JWT token with the file ID
      const token = jwt.sign({ fileId }, JWT_SECRET, {
        expiresIn: LINK_EXPIRATION,
      });

      // Create the download link (you can add dynamic port if needed)
      const downloadLink = `${protocol}://${host}:4000/api/download/${token}`;
      return ok({
        link: downloadLink,
        message: "Download link generated successfully",
      });
    } catch (error: any) {
      this.logger.error(`Failed to generate download link: ${error.message}`);
      return failure(new Error("Failed to generate download link."));
    }
  }

  // Serve file by token
  async serveFileByToken(
    token: string
  ): Promise<Either<Error, FilePathResponseDTO>> {
    this.logger.log(`Serving file for token: ${token}`);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { fileId: string };

      // Fetch file metadata from the database using the decoded file ID
      const file = await this.documentRepository.findDocumentById(
        decoded.fileId
      );

      if (!file) {
        this.logger.error(
          `File with ID ${decoded.fileId} does not exist in DB.`
        );
        return failure(new Error("File metadata not found in DB."));
      }

      const fileName = file.getFileName();
      const fileExtension = file.getFileExtension();

      // Define the directory for downloads
      const downloadsDir = path.join(process.cwd(), "downloads");

      // Ensure the downloads directory exists
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      // Generate the file path
      const filePath = path.join(downloadsDir, `${fileName}.${fileExtension}`);

      // Check if the file exists, if not, create it
      if (!fs.existsSync(filePath)) {
        const fileContent =
          "This is dynamically generated content for your document.";
        fs.writeFileSync(filePath, fileContent);
        this.logger.log(`File created at path: ${filePath}`);
      }

      return ok({ path: filePath, message: "File served successfully" });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return failure(new Error("Download link has expired."));
      }
      if (error.name === "JsonWebTokenError") {
        return failure(new Error("Invalid download token."));
      }
      return failure(new Error("Failed to verify the download token."));
    }
  }
}
