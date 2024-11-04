// src/entities/Document.ts
export class Document {
  private id!: string;
  private fileName!: string;
  private fileExtension!: string;
  private contentType!: string;
  private tags: string[];
  private createdAt: Date;
  private updatedAt: Date;
  private filePath!: string;

  constructor(
    id: string,
    fileName: string,
    fileExtension: string,
    contentType: string,
    tags: string[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    filePath: string = ""
  ) {
    this.setId(id);
    this.setFileName(fileName);
    this.setFileExtension(fileExtension);
    this.setContentType(contentType);
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.setFilePath(filePath);
  }

  public updateFileName(newFileName: string): void {
    this.setFileName(newFileName);
    this.updateTimestamp();
  }

  public updateFileExtension(newFileExtension: string): void {
    this.setFileExtension(newFileExtension);
    this.updateTimestamp();
  }

  public updateContentType(newContentType: string): void {
    this.setContentType(newContentType);
    this.updateTimestamp();
  }

  public updateTags(newTags: string[]): void {
    this.tags = newTags;
    this.updateTimestamp();
  }

  public setFilePath(filePath: string): void {
    this.filePath = filePath;
    this.updateTimestamp();
  }

  private setId(id: string): void {
    if (!id || id.length === 0) {
      throw new Error("ID cannot be empty.");
    }
    this.id = id;
  }

  private setFileName(fileName: string): void {
    if (!fileName || fileName.length === 0) {
      throw new Error("File name cannot be empty.");
    }
    this.fileName = fileName;
  }

  private setFileExtension(fileExtension: string): void {
    if (!fileExtension || fileExtension.length === 0) {
      throw new Error("File extension cannot be empty.");
    }
    this.fileExtension = fileExtension;
  }

  private setContentType(contentType: string): void {
    if (!contentType || contentType.length === 0) {
      throw new Error("Content type cannot be empty.");
    }
    this.contentType = contentType;
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getFileExtension(): string {
    return this.fileExtension;
  }

  public getContentType(): string {
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

  public getFilePath(): string {
    return this.filePath;
  }
}
