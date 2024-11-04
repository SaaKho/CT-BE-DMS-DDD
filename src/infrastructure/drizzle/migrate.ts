import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const migrationClient = postgres(process.env.DATABASE_URL as string, {
  max: 1,
});

async function alterIdColumn() {
  // Execute the SQL statement to alter the column type
  await migrationClient
  // `
    // ALTER TABLE "documents" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
  // `;

  await migrationClient.end();
}

alterIdColumn();
