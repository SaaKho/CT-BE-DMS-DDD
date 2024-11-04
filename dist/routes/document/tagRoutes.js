"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("../../controllers/tagController");
const tagService_1 = require("../../services/tagService");
const tagRepository_1 = require("../../repository/implementations/tagRepository");
const tagRepository = new tagRepository_1.TagRepository();
const tagService = new tagService_1.TagService(tagRepository);
tagController_1.TagController.setTagService(tagService);
const router = express_1.default.Router();
router.post("/addNewTag/:documentId", tagController_1.TagController.addNewTag);
router.put("/updateTag/:documentId", tagController_1.TagController.updateTag);
router.delete("/deleteTag/:documentId", tagController_1.TagController.deleteTag);
exports.default = router;
