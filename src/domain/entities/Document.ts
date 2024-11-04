// src/domain/entities/Document.ts

import { FileName } from "../valueObjects/filename.vo";
import { FileExtension } from "../valueObjects/fileExtension.vo";
import { ContentType } from "../valueObjects/contentType.vo";
import { FilePath } from "../valueObjects/filepath.vo";

export class Document {
  private id: string;
  private fileName: FileName;
  private fileExtension: FileExtension;
  private contentType: ContentType;
  private tags: string[];
  private createdAt: Date;
  private updatedAt: Date;
  private filePath: FilePath;

  constructor(
    id: string,
    fileName: FileName,
    fileExtension: FileExtension,
    contentType: ContentType,
    tags: string[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    filePath: FilePath
  ) {
    if (!id || id.length === 0) {
      throw new Error("ID cannot be empty.");
    }

    this.id = id;
    this.fileName = fileName;
    this.fileExtension = fileExtension;
    this.contentType = contentType;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.filePath = filePath;
  }

  // Update methods
  public updateFileName(newFileName: FileName): void {
    this.fileName = newFileName;
    this.updateTimestamp();
  }

  public updateFileExtension(newFileExtension: FileExtension): void {
    this.fileExtension = newFileExtension;
    this.updateTimestamp();
  }

  public updateContentType(newContentType: ContentType): void {
    this.contentType = newContentType;
    this.updateTimestamp();
  }

  public updateTags(newTags: string[]): void {
    this.tags = newTags;
    this.updateTimestamp();
  }

  public setFilePath(filePath: FilePath): void {
    this.filePath = filePath;
    this.updateTimestamp();
  }

  // Private method to update timestamp
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // Getters for properties
  public getId(): string {
    return this.id;
  }

  public getFileName(): FileName {
    return this.fileName;
  }

  public getFileExtension(): FileExtension {
    return this.fileExtension;
  }

  public getContentType(): ContentType {
    return this.contentType;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getFilePath(): FilePath {
    return this.filePath;
  }
}
