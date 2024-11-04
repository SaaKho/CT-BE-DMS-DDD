// src/domain/value-objects/file-name.vo.ts
export class FileName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error("File name cannot be empty.");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
