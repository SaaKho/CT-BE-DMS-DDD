import { db, documents } from "../drizzle/schema";
import { ilike, arrayContains } from "drizzle-orm";

export const advancedSearchDocuments = async (
  tags?: string | string[],
  fileName?: string,
  contentType?: string
) => {
  let query: any = db.select().from(documents);

  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : (tags as string).split(",");
    query = query.where(arrayContains(documents.tags as any, tagsArray as any));
  }

  if (fileName) {
    query = query.where(ilike(documents.fileName, `%${fileName}%`));
  }

  if (contentType) {
    query = query.where(ilike(documents.contentType, `%${contentType}%`));
  }

  const results = await query.execute();
  return results;
};
