// src/application/dtos/PermissionDTO.ts
export interface PermissionDTO {
  documentId: string;
  userId: string;
  permissionType: string;
}
export interface ShareDocumentDTO {
  documentId: string;
  email?: string;
  permissionType: string;
}


