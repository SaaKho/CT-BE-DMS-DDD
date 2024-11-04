import { Request, Response, NextFunction } from "express";
import { db, permissions } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Define an interface to extend the Request type with a 'user' property
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string }; // Define the structure of user
}

// Middleware to check if the user has the required role
export const roleMiddleware = (requiredRole: string) => {
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

    // Fetch the role of the user for the specific document
    const permissionsQuery = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.documentId, documentId),
          eq(permissions.userId, userId)
        )
      )
      .execute();

    const userRole = permissionsQuery[0]?.permissionType;

    if (!userRole) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the user's role meets the required role or if they are the Owner
    if (userRole !== requiredRole && userRole !== "Owner") {
      return res
        .status(403)
        .json({ message: `Requires ${requiredRole} role or higher` });
    }

    next();
  };
};
