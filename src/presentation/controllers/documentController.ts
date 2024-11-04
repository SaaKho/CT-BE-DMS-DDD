// src/presentation/controllers/documentController.ts
import { Response } from "express";
import { DocumentService } from "../../application/services/documentService";
import { AuthenticatedRequest } from "../../presentation/middleware/roleMiddleware";
import {
  UploadDocumentDTO,
  UpdateDocumentDTO,
  CreateDocumentDTO,
} from "../../application/DTOs/requests/document.dto";

export class DocumentController {
  public static documentService: DocumentService;

  public static setDocumentService(service: DocumentService) {
    DocumentController.documentService = service;
  }

  public static createNewDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { fileName, fileExtension, contentType, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

    const createDocumentDTO: CreateDocumentDTO = {
      userId,
      fileName,
      fileExtension: fileExtension || "",
      contentType,
      tags: tagsArray,
    };

    try {
      const result = await this.documentService.createDocument(
        createDocumentDTO
      );

      res.status(201).json({
        message: "Document created successfully",
        document: result, // Return DTO
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Error creating document", error: error.message });
    }
  };

  public static getDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { documentId } = req.params;
    const result = await this.documentService.getDocument(documentId);

    if ((result as any).error) {
      return res.status(404).json({ message: (result as any).error.message });
    }

    res.status(200).json({ document: (result as any).value });
  };

  public static updateDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { documentId } = req.params;
    const { fileName, fileExtension, contentType, tags, filePath } = req.body;

    const updateDocumentDTO: UpdateDocumentDTO = {
      fileName,
      fileExtension,
      contentType,
      tags: Array.isArray(tags) ? tags : tags.split(","),
      filePath,
    };

    const result = await this.documentService.updateDocument(
      documentId,
      updateDocumentDTO
    );

    if ((result as any).error) {
      return res.status(404).json({ message: (result as any).error.message });
    }

    res.status(200).json({
      message: "Document updated successfully",
      document: (result as any).value,
    });
  };

  public static deleteDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { documentId } = req.params;
    const result = await this.documentService.deleteDocument(documentId);

    if ((result as any).error) {
      return res.status(404).json({ message: (result as any).error.message });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  };

  public static uploadDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { documentId } = req.params;
    const fileName = file.originalname;
    const fileExtension = file.originalname.split(".").pop() || "";
    const contentType = file.mimetype;
    const tags = req.body.tags ? req.body.tags.split(",") : [];

    // Use original filename for file path
    const filePath = `uploads/${fileName}`;

    console.log(
      `Uploading document with file name: ${fileName} and path: ${filePath}`
    );

    const dto: UploadDocumentDTO = {
      fileName,
      fileExtension,
      contentType,
      tags,
      userId,
      documentId,
      filePath,
    };

    const result = await this.documentService.uploadDocument(dto);

    if ((result as any).error) {
      console.error(
        `Error uploading document with ID: ${documentId}, error: ${
          (result as any).error.message
        }`
      );
      return res.status(500).json({ message: (result as any).error.message });
    }

    const documentDto = (result as any).value; // Assuming result.value is the DTO

    res.status(201).json({
      message: "Document uploaded successfully",
      documentId: documentDto.id, // Accessing `id` directly from DTO
      document: documentDto,
    });
  };
}
