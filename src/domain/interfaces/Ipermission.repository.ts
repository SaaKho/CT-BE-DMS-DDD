import { User } from "../../domain/entities/User";

export interface IPermissionRepository {
  sharePermission(
    documentId: string,
    userId: string,
    permissionType: string
  ): Promise<void>;
  findUserByEmail(email: string): Promise<User | null>;
  updatePermission(
    documentId: string,
    userId: string,
    permissionType: string
  ): Promise<void>;
}
