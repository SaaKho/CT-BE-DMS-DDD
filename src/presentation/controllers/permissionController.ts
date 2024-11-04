// src/presentation/controllers/PermissionsController.ts
import { Response } from "express";
import { PermissionsService } from "../../domain/services/permissionService";
import { AuthenticatedRequest } from "../../presentation/middleware/roleMiddleware";
import {
  ShareDocumentDTO,
  PermissionDTO,
} from "../../application/DTOs/requests/permission.dto";
import { Either, Failure, Ok } from "../../utils/monads";
import { inject, injectable } from "inversify";
import { Logger } from "../../infrastructure/logging/logger";

@injectable()
export class PermissionsController {
  constructor(
    @inject("PermissionsService")
    private readonly permissionsService: PermissionsService,
    @inject("Logger") private readonly logger: Logger
  ) {}

  public shareDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { documentId } = req.params;
    const { email, permissionType } = req.body;

    this.logger.log(
      `Received request to share document: ${documentId} with ${email} as ${permissionType}`
    );

    if (!email || !permissionType) {
      return res
        .status(400)
        .json({ message: "Email and permission type are required" });
    }

    const validPermissionTypes = ["Editor", "Viewer"];
    if (!validPermissionTypes.includes(permissionType)) {
      this.logger.error(`Invalid permission type: ${permissionType}`);
      return res.status(400).json({
        message: `Invalid permission type. Must be one of: ${validPermissionTypes.join(
          ", "
        )}`,
      });
    }

    const dto: ShareDocumentDTO = { documentId, email, permissionType };

    try {
      const result: Either<string, PermissionDTO> =
        await this.permissionsService.shareDocumentWithUser(dto);

      if (result.isFailure()) {
        const error = (result as Failure<string>).value;
        this.logger.error(`Failed to share document: ${error}`);
        return res.status(500).json({ message: error });
      }

      const permission = (result as Ok<PermissionDTO>).value;
      this.logger.log(
        `Document ${documentId} shared successfully with ${email} as ${permissionType}`
      );
      return res
        .status(200)
        .json({ message: "Document shared successfully", permission });
    } catch (error: any) {
      this.logger.error(
        `Server error while sharing document: ${error.message}`
      );
      return res.status(500).json({ message: "Server error." });
    }
  };
}
