import { db } from "../drizzle/schema";
import { faker } from "@faker-js/faker";
import { documents, users, permissions } from "../drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  // Seed Users
  const userIds: string[] = [];

  // Create a few users, including an admin user
  const adminUserId = uuidv4();
  userIds.push(adminUserId);

  // Create the admin user
  await db
    .insert(users)
    .values({
      id: adminUserId,
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpassword", 10),
      role: "Admin",
      created_at: new Date(),
      updated_at: new Date(),
    })
    .execute();

  // Create other random users
  for (let i = 0; i < 5; i++) {
    const userId = uuidv4();
    userIds.push(userId);

    await db
      .insert(users)
      .values({
        id: userId,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("password123", 10), // Hashed password for each user
        role: "User",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();
  }

  // Seed Documents
  const documentIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const documentId = uuidv4();
    documentIds.push(documentId);

    const baseFileName = faker.system.fileName().split(".")[0];
    const fileExtension = faker.system.fileExt();
    const contentType = faker.system.mimeType();

    await db
      .insert(documents)
      .values({
        id: documentId,
        fileName: baseFileName,
        fileExtension: fileExtension,
        contentType: contentType,
        tags: [faker.word.noun(), faker.word.noun()],
        createdAt: new Date(),
        updatedAt: new Date(),
        filePath: `uploads/${baseFileName}.${fileExtension}`,
      })
      .execute();
  }

  // Seed Permissions
  for (let i = 0; i < 5; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const documentId = faker.helpers.arrayElement(documentIds);

    await db
      .insert(permissions)
      .values({
        id: uuidv4(),
        documentId: documentId,
        userId: userId,
        permissionType: faker.helpers.arrayElement([
          "Viewer",
          "Editor",
          "Owner",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();
  }

  console.log("Seeding completed.");
}

// // Run the seed function
// seedDatabase()
//   .then(() => console.log("Database seeded successfully."))
//   .catch((error) => console.error("Error seeding database:", error))
//   .finally(() => process.exit());
