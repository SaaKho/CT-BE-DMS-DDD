import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  verbose: true,
  strict: true,
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
