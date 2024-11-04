"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = exports.users = exports.documents = exports.db = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const pg_core_1 = require("drizzle-orm/pg-core");
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
exports.db = (0, node_postgres_1.drizzle)(pool);
exports.documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    fileName: (0, pg_core_1.varchar)("fileName", { length: 255 }).notNull(),
    fileExtension: (0, pg_core_1.varchar)("fileExtension", { length: 10 }).notNull(),
    contentType: (0, pg_core_1.varchar)("contentType", { length: 50 }).notNull(),
    tags: (0, pg_core_1.text)("tags").array().default([]),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("username", { length: 100 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 10 }).notNull().default("User"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.permissions = (0, pg_core_1.pgTable)("permissions", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    documentId: (0, pg_core_1.uuid)("document_id")
        .references(() => exports.documents.id)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    permissionType: (0, pg_core_1.varchar)("permission_type", { length: 10 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
