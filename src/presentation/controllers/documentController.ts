// src/controllers/documentController.ts
import { Response } from "express";
import { DocumentService } from "../../application/services/documentService";
import { documentSchema } from "../validation/documentvalidation";
import { AuthenticatedRequest } from "../../presentation/middleware/authMiddleware";
import { UploadDocumentDTO } from "../../application/DTOs/document.dto";

export class DocumentController {
  public static documentService: DocumentService;

  public static setDocumentService(service: DocumentService) {
    DocumentController.documentService = service;
  }

  public static createNewDocument = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const validation = documentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const { fileName, fileExtension, contentType, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
    const result = await this.documentService.createDocument(
      userId,
      fileName,
      fileExtension || "",
      contentType,
      tagsArray
    );

    if ((result as any).error) {
      return res.status(500).json({ message: (result as any).error.message });
    }

    res.status(201).json({
      message: "Document created successfully",
      document: (result as any).value,
    });
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
    const { fileName, fileExtension, contentType, tags } = req.body;

    const result = await this.documentService.updateDocument(documentId, {
      fileName,
      fileExtension,
      contentType,
      tags: Array.isArray(tags) ? tags : tags.split(","),
    });

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
    const filePath = `src/uploads/${file.filename}`;

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
      return res.status(500).json({ message: (result as any).error.message });
    }

    res.status(201).json({
      message: "Document uploaded successfully",
      documentId: (result as any).value.getId(),
      document: (result as any).value,
    });
  };
}
