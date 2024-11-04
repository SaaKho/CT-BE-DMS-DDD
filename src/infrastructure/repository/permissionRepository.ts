import { db, permissions, users } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { IPermissionRepository } from "../../domain/interfaces/Ipermission.repository";
import { User } from "../../domain/entities/User";
import { v4 as uuidv4 } from "uuid";

export class PermissionRepository implements IPermissionRepository {
  // Share document permission
  async sharePermission(
    documentId: string,
    userId: string,
    permissionType: string
  ): Promise<void> {
    await db
      .insert(permissions)
      .values({
        id: uuidv4(),
        documentId,
        userId,
        permissionType,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];
    return new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.role
    );
  }

  // Update existing permission
  async updatePermission(
    documentId: string,
    userId: string,
    permissionType: string
  ): Promise<void> {
    await db
      .update(permissions)
      .set({ permissionType, updated_at: new Date() })
      .where(
        and(
          eq(permissions.documentId, documentId),
          eq(permissions.userId, userId)
        )
      )
      .execute();
  }
}
