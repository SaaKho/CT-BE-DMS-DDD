"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paginationController_1 = require("../../controllers/paginationController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/documents", paginationController_1.PaginationController.getPaginatedDocuments);
router.get("/users", authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)("Admin"), paginationController_1.PaginationController.getPaginatedUsers);
exports.default = router;
