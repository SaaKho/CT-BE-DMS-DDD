// src/repository/interfaces/ITagRepository.ts
import { Document } from "../../domain/entities/Document";
import { Tag } from "../valueObjects/Tag";

export interface ITagRepository {
  addTag(documentId: string, tag: Tag): Promise<Document>;
  updateTag(documentId: string, oldTag: Tag, newTag: Tag): Promise<Document>;
  deleteTag(documentId: string, tag: Tag): Promise<Document>;
}
