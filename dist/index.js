"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/users/authRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/document/documentRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/document/tagRoutes"));
const downloadRoutes_1 = __importDefault(require("./routes/document/downloadRoutes"));
const searchRoute_1 = __importDefault(require("./routes/document/searchRoute"));
const permissionRoutes_1 = __importDefault(require("./routes/users/permissionRoutes"));
const paginationRoutes_1 = __importDefault(require("./routes/document/paginationRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use("/api/users", authRoutes_1.default);
app.use("/api/documents", documentRoutes_1.default);
app.use("/api/tags", tagRoutes_1.default);
app.use("/api/download", downloadRoutes_1.default);
app.use("/api/search", searchRoute_1.default);
app.use("/api/documents", permissionRoutes_1.default);
app.use("/api/pagination", paginationRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
