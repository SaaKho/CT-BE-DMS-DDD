"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const documentService_1 = require("../../services/documentService");
const documentController_1 = require("../../controllers/documentController");
const documentRepository_1 = require("../../repository/implementations/documentRepository");
const documentService = new documentService_1.DocumentService(new documentRepository_1.DocumentRepository());
documentController_1.DocumentController.setDocumentService(documentService);
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/create", authMiddleware_1.authMiddleware, documentController_1.DocumentController.createNewDocument);
router.get("/getDocument/:documentId", authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(["Viewer", "Editor", "Owner"]), documentController_1.DocumentController.getDocument);
router.put("/updateDocument/:documentId", authMiddleware_1.authMiddleware, documentController_1.DocumentController.updateDocument);
router.post("/uploadDocument", authMiddleware_1.authMiddleware, upload.single("file"), documentController_1.DocumentController.uploadDocument);
router.delete("/deleteDocument/:documentId", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, documentController_1.DocumentController.deleteDocument);
exports.default = router;
