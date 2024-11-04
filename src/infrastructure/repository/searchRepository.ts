// src/repository/implementations/SearchRepository.ts
import { db, documents } from "../drizzle/schema";
import { ilike, arrayContains } from "drizzle-orm";
import { ISearchRepository } from "../../domain/interfaces/Isearch.repository";
import { Document } from "../../domain/entities/Document";

export class SearchRepository implements ISearchRepository {
  async advancedSearch(
    tags?: string[],
    fileName?: string,
    contentType?: string
  ): Promise<Document[]> {
    let query: any = db.select().from(documents);

    if (tags && tags.length > 0) {
      query = query.where(arrayContains(documents.tags as any, tags as any));
    }

    if (fileName) {
      query = query.where(ilike(documents.fileName, `%${fileName}%`));
    }

    if (contentType) {
      query = query.where(ilike(documents.contentType, `%${contentType}%`));
    }

    const results = await query.execute();

    // Map results to Document instances
    return results.map((result: any) => {
      return new Document(
        result.id,
        result.fileName,
        result.fileExtension,
        result.contentType,
        result.tags || [],
        result.createdAt ? new Date(result.createdAt) : new Date(),
        result.updatedAt ? new Date(result.updatedAt) : new Date(),
        result.filePath || ""
      );
    });
  }
}
