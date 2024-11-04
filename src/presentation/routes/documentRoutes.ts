// src/routes/documentRoutes.ts
import express from "express";
import multer from "multer";
import { AuthMiddleware } from "../../presentation/middleware/authMiddleware";
import { roleMiddleware } from "../../presentation/middleware/roleMiddleware";
import { DocumentService } from "../../application/services/documentService";
import { DocumentController } from "../../presentation/controllers/documentController";
import { DocumentRepository } from "../../infrastructure/repository/documentRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";
import { JwtAuthHandler } from "../../infrastructure/auth/handlers/JWTAuthHandler";
import { UserRepository } from "../../infrastructure/repository/userRepository";

const router = express.Router();

// Initialize repository, logger, and service instances
const documentRepository = new DocumentRepository();
const logger = new ConsoleLogger();
const documentService = new DocumentService();
const userRepository = new UserRepository();
const authHandler = new JwtAuthHandler(userRepository);

// Use property injection to set dependencies
documentService.documentRepository = documentRepository;
documentService.logger = logger;
DocumentController.documentService = documentService;

// Instantiate authMiddleware with the auth handler
const authMiddleware = new AuthMiddleware(authHandler);

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads"); // Ensure this path is correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Route definitions
router.post(
  "/createDocument",
  authMiddleware.authenticate,
  DocumentController.createNewDocument
);
//Need to make sure the create API only does what it is doing right now that
//storing an instance of the file. The file will be uploaded using the upload endpoint and a filepath should be created as reference
//but still want to discuss the changes in the schema do i add content and filepath to the schema
//do i make a seperate table for the content management

router.get(
  "/getDocument/:documentId",
  authMiddleware.authenticate,
  roleMiddleware(["Viewer", "Editor", "Owner"]),
  DocumentController.getDocument
);
router.put(
  "/updateDocument/:documentId",
  authMiddleware.authenticate,
  DocumentController.updateDocument
);
// router.post(
//   "/uploadDocument",
//   authMiddleware.authenticate,
//   upload.single("file"),
//   DocumentController.uploadDocument
// );
// src/routes/documentRoutes.ts
router.post(
  "/uploadDocument/:documentId",
  authMiddleware.authenticate,
  upload.single("file"),
  DocumentController.uploadDocument
);

router.delete(
  "/deleteDocument/:documentId",
  authMiddleware.authenticate,
  // adminMiddleware,
  DocumentController.deleteDocument
);

export default router;
