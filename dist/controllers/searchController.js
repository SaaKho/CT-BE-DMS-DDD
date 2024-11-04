"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
class SearchController {
    static setSearchService(service) {
        _a.searchService = service;
    }
}
exports.SearchController = SearchController;
_a = SearchController;
SearchController.advancedSearch = async (req, res) => {
    const { tags, fileName, contentType } = req.query;
    const dto = {
        tags: tags,
        fileName: fileName,
        contentType: contentType,
    };
    try {
        const results = await _a.searchService.advancedSearch(dto);
        res.status(200).json({
            message: "Documents retrieved successfully",
            documents: results,
        });
    }
    catch (error) {
        console.error("Error retrieving documents:", error);
        res.status(500).json({ error: "Failed to retrieve documents" });
    }
};
