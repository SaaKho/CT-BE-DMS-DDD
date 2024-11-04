"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchController_1 = require("../../controllers/searchController");
const searchService_1 = require("../../services/searchService");
const searchRepository_1 = require("../../repository/implementations/searchRepository");
const searchRepository = new searchRepository_1.SearchRepository();
const searchService = new searchService_1.SearchService(searchRepository);
searchController_1.SearchController.setSearchService(searchService);
const router = express_1.default.Router();
router.get("/advancedSearch", searchController_1.SearchController.advancedSearch);
exports.default = router;
