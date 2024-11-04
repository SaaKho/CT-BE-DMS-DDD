// src/repository/interfaces/ISearchRepository.ts
import { Document } from "../../domain/entities/Document";

export interface ISearchRepository {
  advancedSearch(
    tags?: string[],
    fileName?: string,
    contentType?: string
  ): Promise<Document[]>;
}
