"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const documentvalidation_1 = require("../validation/documentvalidation");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class DocumentController {
    static setDocumentService(service) {
        this.documentService = service;
    }
}
exports.DocumentController = DocumentController;
_a = DocumentController;
DocumentController.createNewDocument = async (req, res) => {
    try {
        const validation = documentvalidation_1.documentSchema.safeParse(req.body);
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
        const fullFileName = `${fileName}.${fileExtension}`;
        const documentsDir = path_1.default.join(process.cwd(), "src", "documents");
        if (!fs_1.default.existsSync(documentsDir)) {
            fs_1.default.mkdirSync(documentsDir, { recursive: true });
        }
        const filePath = path_1.default.join(documentsDir, fullFileName);
        fs_1.default.writeFileSync(filePath, "Placeholder content for the document");
        const newDocument = await _a.documentService.createDocument(userId, fileName, fileExtension, contentType, tagsArray);
        res.status(201).json({
            message: "Document created successfully",
            document: newDocument,
            filePath,
        });
    }
    catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Failed to create document" });
    }
};
DocumentController.getDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await _a.documentService.getDocument(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({ document });
    }
    catch (error) {
        console.error("Error retrieving document:", error);
        res.status(500).json({ message: "Failed to retrieve document" });
    }
};
DocumentController.updateDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { fileName, fileExtension, contentType, tags } = req.body;
        const updates = {};
        if (fileName)
            updates.fileName = fileName;
        if (fileExtension)
            updates.fileExtension = fileExtension;
        if (contentType)
            updates.contentType = contentType;
        if (tags)
            updates.tags = Array.isArray(tags) ? tags : tags.split(",");
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }
        const updatedDocument = await _a.documentService.updateDocument(documentId, updates);
        if (!updatedDocument) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({
            message: "Document updated successfully",
            document: updatedDocument,
        });
    }
    catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Failed to update document" });
    }
};
DocumentController.deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        await _a.documentService.deleteDocument(documentId);
        res.status(200).json({ message: "Document deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Failed to delete document" });
    }
};
DocumentController.uploadDocument = async (req, res) => {
    try {
        const { fileName, fileExtension, contentType, tags } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const newDocument = await _a.documentService.uploadDocument(fileName, fileExtension, contentType, tagsArray);
        if (!newDocument) {
            return res.status(500).json({ message: "Failed to create document" });
        }
        res.status(201).json({
            message: "Document uploaded successfully",
            documentId: newDocument.id,
            document: newDocument,
        });
    }
    catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({ message: "Failed to upload document" });
    }
};
