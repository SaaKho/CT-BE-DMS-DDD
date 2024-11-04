// src/migrations/seedData.ts
import { db } from "../drizzle/schema";
import { faker } from "@faker-js/faker";
import { documents, users, permissions } from "../drizzle/schema";
import { v4 as uuidv4 } from "uuid";

async function seedDatabase() {
  // Seed Documents
  for (let i = 0; i < 2; i++) {
    const baseFileName = faker.word.noun();
    const fileExtension = faker.system.fileExt();
    const contentType = faker.system.mimeType();

    await db
      .insert(documents)
      .values({
        id: uuidv4(),
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
}

//The point is should we seed users and permissions tables as well?Let alone admin user ?
//Tough decision to make

//   // Seed Permissions
//   const userIds = await db.select({ id: users.id }).from(users).execute();
//   const documentIds = await db
//     .select({ id: documents.id })
//     .from(documents)
//     .execute();

//   for (let i = 0; i < 2; i++) {
//     const user = faker.helpers.arrayElement(userIds);
//     const document = faker.helpers.arrayElement(documentIds);

//     await db
//       .insert(permissions)
//       .values({
//         id: uuidv4(),
//         documentId: document.id,
//         userId: user.id,
//         permissionType: faker.helpers.arrayElement([
//           "Viewer",
//           "Editor",
//           "Owner",
//         ]),
//         created_at: new Date(),
//         updated_at: new Date(),
//       })
//       .execute();
//   }

//   console.log("Seeding completed.");
//}

// // Run the seed function
// seedDatabase()
//   .then(() => console.log("Database seeded successfully."))
//   .catch((error) => console.error("Error seeding database:", error))
//   .finally(() => process.exit());
