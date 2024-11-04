"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationController = void 0;
const paginationService_1 = require("../services/paginationService");
class PaginationController {
}
exports.PaginationController = PaginationController;
_a = PaginationController;
PaginationController.paginationService = new paginationService_1.PaginationService();
PaginationController.getPaginatedDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const paginatedData = await _a.paginationService.getPaginatedDocuments(Number(page), Number(limit));
        return res.status(200).json(paginatedData);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to fetch paginated documents", error });
    }
};
PaginationController.getPaginatedUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const paginatedData = await _a.paginationService.getPaginatedUsers(Number(page), Number(limit));
        return res.status(200).json(paginatedData);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to fetch paginated users", error });
    }
};
