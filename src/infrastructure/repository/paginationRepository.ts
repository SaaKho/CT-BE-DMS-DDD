import { db, documents, users } from "../drizzle/schema";
import { IPaginationRepository } from "../../domain/interfaces/Ipagination.repository";
import { Document } from "../../domain/entities/Document";
import { User } from "../../domain/entities/User";

export class PaginationRepository implements IPaginationRepository {
  // Fetch paginated documents
  async getPaginatedDocuments(
    page: number,
    limit: number
  ): Promise<{ data: Document[]; totalItems: number }> {
    const offset = (page - 1) * limit;

    try {
      // Query to get total number of documents
      const totalItemsQuery = await db.select().from(documents);
      const totalItems = totalItemsQuery.length;

      // Query to get paginated data
      const paginatedData = await db
        .select()
        .from(documents)
        .limit(limit)
        .offset(offset)
        .execute();

      // Map the paginated data to Document instances
      const documentsData = paginatedData.map(
        (doc) =>
          new Document(
            doc.id, // Include the id field
            doc.fileName,
            doc.fileExtension,
            doc.contentType,
            doc.tags || [], // Ensure tags is an array
            doc.createdAt || new Date(),
            doc.updatedAt || new Date()
          )
      );

      return {
        data: documentsData,
        totalItems,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated documents: ${error.message}`);
    }
  }

  // Fetch paginated users
  async getPaginatedUsers(
    page: number,
    limit: number
  ): Promise<{ data: User[]; totalItems: number }> {
    const offset = (page - 1) * limit;

    try {
      // Query to get total number of users
      const totalItemsQuery = await db.select().from(users);
      const totalItems = totalItemsQuery.length;

      // Query to get paginated data
      const paginatedData = await db
        .select()
        .from(users)
        .limit(limit)
        .offset(offset)
        .execute();

      // Map the paginated data to User instances
      const usersData = paginatedData.map(
        (userRecord) =>
          new User(
            userRecord.id,
            userRecord.username,
            userRecord.email,
            userRecord.password,
            userRecord.role
          )
      );

      return {
        data: usersData,
        totalItems,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated users: ${error.message}`);
    }
  }
}
