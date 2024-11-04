import express, { Request, Response } from "express";
import multer from "multer";
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  uploadDocument,
  deleteDocumentById,
} from "../../services/documentService";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { authorizeRole, authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = `document_${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Get all documents
router.get("/getAllDocuments", async (req: Request, res: Response) => {
  try {
    const documents = await getAllDocuments();
    res.status(200).json({
      message: "Documents retrieved successfully",
      documents,
    });
  } catch (error: any) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
});

// Get document by ID
router.get("/getDocument/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const document = await getDocumentById(id);
    if (document.length > 0) {
      res.status(200).json({
        message: "Document retrieved successfully",
        document: document[0],
      });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error: any) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
});

// Create a new document
router.post(
  "/createNewDocument",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { fileName, fileExtension, contentType, tags } = req.body;

    if (!fileName || !fileExtension || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const { newDocument, fullFilePath } = await createDocument(
        fileName,
        fileExtension,
        contentType,
        tags
      );
      res.status(201).json({
        message: "Document created successfully",
        document: newDocument,
        filePath: fullFilePath,
      });
    } catch (error: any) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  }
);

// Upload a document
router.post(
  "/uploadDocument",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { tags } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const { newDocument, filePath } = await uploadDocument(file, tags);
      res.status(201).json({
        message: "Document uploaded successfully",
        document: newDocument,
        filePath,
      });
    } catch (error: any) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  }
);

// Delete a document by ID
router.delete(
  "/deleteDocument/:id",
  authorizeRole("Admin"),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deletedDocument = await deleteDocumentById(id);

      if (!deletedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({
        message: "Document deleted successfully",
        document: deletedDocument,
      });
    } catch (error: any) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ error: "Failed to delete document" });
    }
  }
);

export default router;
