import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/pg-core";

dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM with the pool
export const db = drizzle(pool);

// Define the documents table schema with UUID
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey(), // Removed .defaultRandom()
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileExtension: varchar("fileExtension", { length: 10 }).notNull(),
  contentType: varchar("contentType", { length: 50 }).notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  filePath: text("filePath").notNull(),
});

// Define the users table schema with UUID and role
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Removed .defaultRandom()
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 10 }).notNull().default("User"),
  created_at: timestamp("createdAt").defaultNow(),
  updated_at: timestamp("updatedAt").defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" }) // Add onDelete cascade
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  permissionType: varchar("permission_type", { length: 10 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
