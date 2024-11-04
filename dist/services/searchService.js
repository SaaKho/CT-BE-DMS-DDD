"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
class SearchService {
    constructor(searchRepository) {
        this.searchRepository = searchRepository;
    }
    async advancedSearch(dto) {
        const tags = dto.tags ? dto.tags.split(",") : [];
        const fileName = dto.fileName || undefined;
        const contentType = dto.contentType || undefined;
        return this.searchRepository.advancedSearch(tags, fileName, contentType);
    }
}
exports.SearchService = SearchService;
