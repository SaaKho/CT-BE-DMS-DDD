"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadRepository = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";
const LINK_EXPIRATION = process.env.LINK_EXPIRATION || "15m";
class DownloadRepository {
    generateDownloadLink(dto) {
        const token = jsonwebtoken_1.default.sign({ filename: dto.filename }, JWT_SECRET, {
            expiresIn: LINK_EXPIRATION,
        });
        return `${dto.protocol}://${dto.host}/api/download/${token}`;
    }
    serveFileByToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const downloadsDir = path_1.default.join(__dirname, "../../src/download");
        if (!fs_1.default.existsSync(downloadsDir)) {
            fs_1.default.mkdirSync(downloadsDir, { recursive: true });
        }
        const downloadFilePath = path_1.default.join(downloadsDir, decoded.filename);
        fs_1.default.writeFileSync(downloadFilePath, "This is the content of your document.");
        return downloadFilePath;
    }
}
exports.DownloadRepository = DownloadRepository;
