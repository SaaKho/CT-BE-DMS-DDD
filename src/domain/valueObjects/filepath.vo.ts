// src/domain/value-objects/file-path.vo.ts
export class FilePath {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error("File path cannot be empty.");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
