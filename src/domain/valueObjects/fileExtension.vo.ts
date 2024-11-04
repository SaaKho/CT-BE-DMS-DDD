// src/domain/value-objects/file-extension.vo.ts
export class FileExtension {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error("File extension cannot be empty.");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
