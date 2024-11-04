// import { AuthenticatedRequest } from "../../src/middleware/authMiddleware";
// import { db, permissions } from "../../src/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { db, permissions } from "../../infrastructure/drizzle/schema";

export const sharePermissionMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const permissionsResult = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.documentId, documentId),
          eq(permissions.userId, userId)
        )
      )
      .execute();

    const userRole = permissionsResult[0]?.permissionType;

    if (!userRole || !["Owner", "Editor"].includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. Only Owner or Editor can share the document.",
      });
    }
    next();
  } catch (error) {
    console.error("Error checking permissions:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
