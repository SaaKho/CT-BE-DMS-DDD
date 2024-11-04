// src/presentation/middleware/SharePermissionMiddleware.ts
import { eq, and } from "drizzle-orm";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/roleMiddleware";
import { db, permissions } from "../../infrastructure/drizzle/schema";
import { Logger } from "../../infrastructure/logging/logger";
import { inject, injectable } from "inversify";

@injectable()
export class SharePermissionMiddleware {
  constructor(@inject("Logger") private readonly logger: Logger) {}

  public sharePermissionMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { documentId } = req.params;
    const userId = req.user?.id;

    this.logger.log(
      `Checking permission for user ${userId} on document ${documentId}`
    );

    if (!userId) {
      this.logger.error("User not authenticated.");
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
        this.logger.error(
          `User ${userId} does not have permission to share document ${documentId}`
        );
        return res.status(403).json({
          message:
            "Access denied. Only Owner or Editor can share the document.",
        });
      }

      this.logger.log(
        `User ${userId} has permission to share document ${documentId}`
      );
      next();
    } catch (error: any) {
      this.logger.error(
        `Error checking permissions for user ${userId}: ${error.message}`
      );
      return res.status(500).json({ message: "Server error." });
    }
  };
}
