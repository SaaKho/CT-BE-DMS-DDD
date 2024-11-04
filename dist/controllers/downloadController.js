"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadController = void 0;
class DownloadController {
    static setDownloadService(service) {
        _a.downloadService = service;
    }
}
exports.DownloadController = DownloadController;
_a = DownloadController;
DownloadController.generateLink = async (req, res) => {
    const { filename } = req.params;
    try {
        const dto = {
            filename,
            protocol: req.protocol,
            host: req.get("host"),
        };
        const downloadLink = _a.downloadService.generateDownloadLink(dto);
        res.status(200).json({ downloadLink });
    }
    catch (error) {
        console.error("Error generating download link:", error);
        res.status(500).json({ error: "Failed to generate download link" });
    }
};
DownloadController.downloadFile = async (req, res) => {
    const { token } = req.params;
    try {
        const downloadFilePath = _a.downloadService.serveFileByToken(token);
        res.download(downloadFilePath);
    }
    catch (error) {
        if (error.message === "File not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Download link has expired" });
        }
        console.error("Error downloading file:", error);
        res.status(500).json({ error: "Failed to download file" });
    }
};
