"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const migrationClient = (0, postgres_1.default)(process.env.DATABASE_URL, {
    max: 1,
});
async function alterIdColumn() {
    await migrationClient;
    await migrationClient.end();
}
alterIdColumn();
