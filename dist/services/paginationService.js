"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const paginationRepository_1 = require("../repository/implementations/paginationRepository");
class PaginationService {
    constructor() {
        this.paginationRepository = new paginationRepository_1.PaginationRepository();
    }
    async getPaginatedDocuments(page, limit) {
        const paginatedData = await this.paginationRepository.getPaginatedDocuments(page, limit);
        return {
            data: paginatedData.data,
            currentPage: page,
            totalPages: Math.ceil(paginatedData.totalItems / limit),
            totalItems: paginatedData.totalItems,
        };
    }
    async getPaginatedUsers(page, limit) {
        const paginatedData = await this.paginationRepository.getPaginatedUsers(page, limit);
        return {
            data: paginatedData.data,
            currentPage: page,
            totalPages: Math.ceil(paginatedData.totalItems / limit),
            totalItems: paginatedData.totalItems,
        };
    }
}
exports.PaginationService = PaginationService;
