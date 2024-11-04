"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
class TagService {
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    async addNewTag(dto) {
        return this.tagRepository.addTag(dto.documentId, dto.tagName);
    }
    async updateTag(dto) {
        return this.tagRepository.updateTag(dto.documentId, dto.oldTagName, dto.newTagName);
    }
    async deleteTag(dto) {
        return this.tagRepository.deleteTag(dto.documentId, dto.tagName);
    }
}
exports.TagService = TagService;
