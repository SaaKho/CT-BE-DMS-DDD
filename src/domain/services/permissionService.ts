// src/application/services/PermissionsService.ts
import { IPermissionRepository } from "../interfaces/Ipermission.repository";
import { User } from "../entities/User";
import { Logger } from "../../infrastructure/logging/logger";
import { Either, ok, failure } from "../../utils/monads";
import { PermissionDTO } from "../../application/DTOs/permission.dto";

export class PermissionsService {
  private _permissionRepository!: IPermissionRepository;
  private _logger!: Logger;

  // Setters for property injection
  set permissionRepository(repository: IPermissionRepository) {
    this._permissionRepository = repository;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  async shareDocumentWithUser(
    documentId: string,
    email: string,
    permissionType: string
  ): Promise<Either<string, PermissionDTO>> {
    this._logger.log(
      `Attempting to share document ${documentId} with ${email} as ${permissionType}`
    );

    try {
      const targetUser: User | null =
        await this._permissionRepository.findUserByEmail(email);

      if (!targetUser) {
        this._logger.error(`User with email ${email} not found.`);
        return failure("User with this email does not exist.");
      }

      try {
        this._logger.log(
          `Updating permission for document ${documentId} and user ${email}`
        );
        await this._permissionRepository.updatePermission(
          documentId,
          targetUser.getId(),
          permissionType
        );
      } catch (updateError) {
        this._logger.log(
          `No existing permission found. Sharing document ${documentId} with ${email} as ${permissionType}`
        );
        await this._permissionRepository.sharePermission(
          documentId,
          targetUser.getId(),
          permissionType
        );
      }

      this._logger.log(
        `Document ${documentId} shared successfully with ${email} as ${permissionType}`
      );

      const permissionDTO: PermissionDTO = {
        documentId,
        userId: targetUser.getId(),
        permissionType,
      };

      return ok(permissionDTO);
    } catch (error: any) {
      this._logger.error(
        `Error sharing document ${documentId} with ${email}: ${error.message}`
      );
      return failure("Failed to share document");
    }
  }
}
