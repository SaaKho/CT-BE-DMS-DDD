import express, { Request, Response } from "express";
import { db, documents } from "../../drizzle/schema";
import { eq, ilike, arrayContains } from "drizzle-orm";

const router = express.Router();

// Advanced search route
router.get("/advancedSearch", async (req: Request, res: Response) => {
  const { tags, fileName, contentType } = req.query;

  try {
    let query = db.select().from(documents);

    // If tags are provided, filter by tags using arrayContains
    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : (tags as string).split(",");
      query.where(arrayContains(documents.tags as any, tagsArray as any));
    }

    if (fileName) {
      query.where(ilike(documents.fileName, `%${fileName}%`));
    }

    if (contentType) {
      query.where(ilike(documents.contentType, `%${contentType}%`));
    }

    const results = await query.execute();

    // Respond with the results
    res.status(200).json({
      message: "Documents retrieved successfully",
      documents: results,
    });
  } catch (error: any) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
});

export default router;
