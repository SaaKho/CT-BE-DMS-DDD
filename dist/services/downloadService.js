"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadService = void 0;
class DownloadService {
    constructor(downloadRepository) {
        this.downloadRepository = downloadRepository;
    }
    generateDownloadLink(dto) {
        return this.downloadRepository.generateDownloadLink(dto);
    }
    serveFileByToken(token) {
        return this.downloadRepository.serveFileByToken(token);
    }
}
exports.DownloadService = DownloadService;
