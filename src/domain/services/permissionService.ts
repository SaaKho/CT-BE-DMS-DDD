// src/application/services/PermissionsService.ts

import { Logger } from "../../infrastructure/logging/logger";
import { User } from "../../domain/entities/User";
import { UserPassword } from "../../domain/valueObjects/user-password.vo";
import { Username } from "../../domain/valueObjects/username.vo";
import { Email } from "../../domain/valueObjects/user-email.vo";
import { Role } from "../../domain/valueObjects/user-role.vo";
import { db, permissions, users } from "../../infrastructure/drizzle/schema";
import { Either, ok, failure } from "../../utils/monads";
import {
  PermissionDTO,
  ShareDocumentDTO,
} from "../../application/DTOs/requests/permission.dto";
import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

@injectable()
export class PermissionsService {
  constructor(@inject("Logger") private readonly logger: Logger) {}

  public async shareDocumentWithUser(
    dto: ShareDocumentDTO
  ): Promise<Either<string, PermissionDTO>> {
    const { documentId, email, permissionType = "Viewer" } = dto;

    this.logger.log(
      `Attempting to share document ${documentId} with user ${email} as ${permissionType}`
    );

    if (!email) {
      this.logger.error("Email is required.");
      return failure("Email is required.");
    }

    const targetUser = await this.findUserByEmail(email);
    if (!targetUser) {
      this.logger.error(`User with email ${email} not found.`);
      return failure("User with this email does not exist.");
    }

    try {
      this.logger.log(
        `Checking if existing permission needs to be updated for document ${documentId}`
      );
      await this.updatePermission(
        documentId,
        targetUser.getId(),
        permissionType
      );
    } catch (updateError) {
      this.logger.log(
        `No existing permission found. Sharing document ${documentId} with ${email} as ${permissionType}`
      );
      await this.sharePermission(
        documentId,
        targetUser.getId(),
        permissionType
      );
    }

    this.logger.log(
      `Document ${documentId} shared successfully with user ${email} as ${permissionType}`
    );

    const permissionDTO: PermissionDTO = {
      documentId,
      userId: targetUser.getId(),
      permissionType,
    };

    return ok(permissionDTO);
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];
    const userPassword = UserPassword.fromHashed(user.password);
    return new User(
      user.id,
      new Username(user.username),
      new Email(user.email),
      userPassword,
      new Role(user.role)
    );
  }

  private async updatePermission(
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

  private async sharePermission(
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
}
