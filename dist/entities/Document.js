"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
class Document {
    constructor(id, fileName, fileExtension, contentType, tags, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.contentType = contentType;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Document = Document;
