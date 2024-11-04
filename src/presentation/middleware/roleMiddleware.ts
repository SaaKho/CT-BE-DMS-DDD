// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { db, permissions } from "../../infrastructure/drizzle/schema";
import { eq, and } from "drizzle-orm";

// Define the structure of the JWT payload
interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Extend Request to include user
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Middleware for role-based authorization
export const roleMiddleware = (requiredRoles: string[]) => {
  return async (
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
      // Fetch the user's role for the specific document
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

      if (permissionsResult.length === 0) {
        return res
          .status(403)
          .json({ message: "Access denied. No permission for this document." });
      }

      const userRole = permissionsResult[0].permissionType;

      if (requiredRoles.includes(userRole)) {
        return next();
      }

      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };
};

// Create a specific middleware for Admin role if needed
export const adminMiddleware = roleMiddleware(["Admin"]);
