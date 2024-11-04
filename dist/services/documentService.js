"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const uuid_1 = require("uuid");
const entitiy_factory_1 = require("../factories/entitiy.factory");
class DocumentService {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    async createDocument(userId, fileName, fileExtension, contentType, tags) {
        const newDocumentId = (0, uuid_1.v4)();
        const newDocument = entitiy_factory_1.EntityFactory.createDocument(newDocumentId, fileName, fileExtension, contentType, tags);
        await this.documentRepository.createDocument(newDocument);
        await this.documentRepository.assignOwnerPermission(newDocumentId, userId);
        return newDocument;
    }
    async getDocument(documentId) {
        return await this.documentRepository.findDocumentById(documentId);
    }
    async deleteDocument(documentId) {
        await this.documentRepository.deleteDocument(documentId);
    }
    async updateDocument(documentId, updates) {
        return await this.documentRepository.updateDocument(documentId, updates);
    }
    async uploadDocument(fileName, fileExtension, contentType, tags) {
        const newDocument = entitiy_factory_1.EntityFactory.createDocument((0, uuid_1.v4)(), fileName, fileExtension, contentType, tags);
        return await this.documentRepository.createDocument(newDocument);
    }
}
exports.DocumentService = DocumentService;
