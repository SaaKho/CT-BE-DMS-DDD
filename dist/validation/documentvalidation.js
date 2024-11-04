"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentSchema = void 0;
const zod_1 = require("zod");
exports.documentSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1, "File name is required"),
    fileExtension: zod_1.z.string().min(1, "File extension is required"),
    contentType: zod_1.z.string().min(1, "Content type is required"),
    tags: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
});
