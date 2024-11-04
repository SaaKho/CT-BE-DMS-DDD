// src/domain/value-objects/content-type.vo.ts
export class ContentType {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error("Content type cannot be empty.");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
