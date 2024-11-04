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
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// Define the UserRole enum
export enum UserRole {
  User = "User",
  Admin = "Admin",
}

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM with the pool
export const db = drizzle(pool);

// Define the documents table schema with UUID
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileExtension: varchar("fileExtension", { length: 10 }).notNull(),
  contentType: varchar("contentType", { length: 50 }).notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Define the users table schema with UUID and role
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 10 }).notNull().default(UserRole.User),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Function to insert sample documents (can be used for testing or seeding)
// export async function insertSampleDocuments() {
//   try {
//     await db.insert(documents).values({
//       title: "Quarterly Financial Report",
//       content: "Detailed financial report for Q2 2024...",
//       author: "John Doe",
//       tags: ["finance", "report", "Q2", "2024"],
//       metadata: {
//         department: "finance",
//         year: 2024,
//         reviewed: true,
//       },
//     });

//     await db.insert(documents).values({
//       title: "Project Plan for Solar Energy Initiative",
//       content:
//         "This document outlines the project plan for the solar energy initiative...",
//       author: "Jane Smith",
//       tags: ["project", "solar", "energy", "sustainability"],
//       metadata: {
//         project_name: "Solar Energy Initiative",
//         start_date: "2024-01-01",
//         end_date: "2024-12-31",
//         stakeholders: ["Jane Smith", "John Doe", "Alice Johnson"],
//         department: "Engineering",
//         priority: "High",
//       },
//     });

//     console.log("Sample documents inserted successfully.");
//   } catch (error: any) {
//     console.error("Failed to insert sample documents:", error);
//   }
// }

// insertSampleDocuments();

export async function insertAdmin() {
  try {
    await db.insert(users).values({
      username: "Admin1",
      email: "Admin@hotmail.com",
      password: await bcrypt.hash("adminpassword", 10),
      role: "Admin",
    });
    console.log("Sample Admin created successfully.");
  } catch (error: any) {
    console.error("Failed to create admin:", error);
  }
}

// insertAdmin();

export async function insertUser() {
  try {
    await db.insert(users).values({
      username: "testUser2",
      email: "testuser@hotmail.com",
      password: await bcrypt.hash("userpassword", 10),
      role: "user",
    });
    console.log("Sample User created successfully.");
  } catch (error: any) {
    console.error("Failed to create User:", error);
  }
}
// insertUser();
