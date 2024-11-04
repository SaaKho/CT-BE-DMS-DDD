import { Response } from "express";
import { PermissionsService } from "../../domain/services/permissionService";
import { AuthenticatedRequest } from "../../presentation/middleware/authMiddleware";

export class PermissionsController {
  private static permissionService: PermissionsService;

  static setPermissionsService(service: PermissionsService) {
    PermissionsController.permissionService = service;
  }

  static shareDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { documentId } = req.params;
    const { email, permissionType } = req.body;

    // Validate input
    if (!email || !permissionType) {
      return res
        .status(400)
        .json({ message: "Email and permission type are required" });
    }

    const validPermissionTypes = ["Editor", "Viewer"];
    if (!validPermissionTypes.includes(permissionType)) {
      return res.status(400).json({
        message: `Invalid permission type. Must be one of: ${validPermissionTypes.join(
          ", "
        )}`,
      });
    }

    try {
      const message =
        await PermissionsController.permissionService.shareDocumentWithUser(
          documentId,
          email,
          permissionType
        );
      res.status(200).json({ message });
    } catch (error) {
      return res.status(500).json({ message: "Server error." });
    }
  };
}
