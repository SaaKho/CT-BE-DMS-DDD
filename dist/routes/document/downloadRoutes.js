"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const downloadController_1 = require("../../controllers/downloadController");
const downloadService_1 = require("../../services/downloadService");
const downloadRepository_1 = require("../../repository/implementations/downloadRepository");
const router = express_1.default.Router();
const downloadRepository = new downloadRepository_1.DownloadRepository();
const downloadService = new downloadService_1.DownloadService(downloadRepository);
downloadController_1.DownloadController.setDownloadService(downloadService);
router.post("/generate-download-link/:filename", downloadController_1.DownloadController.generateLink);
router.get("/:token", downloadController_1.DownloadController.downloadFile);
exports.default = router;
