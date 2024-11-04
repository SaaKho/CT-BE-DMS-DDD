// src/repository/interfaces/IPaginationRepository.ts
import { Document } from "../entities/Document";
import { User } from "../entities/User";

export interface IPaginationRepository {
  getPaginatedDocuments(
    page: number,
    limit: number
  ): Promise<{ data: Document[]; totalItems: number }>;

  getPaginatedUsers(
    page: number,
    limit: number
  ): Promise<{ data: User[]; totalItems: number }>;
}
