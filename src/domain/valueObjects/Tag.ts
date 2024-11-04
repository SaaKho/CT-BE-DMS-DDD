// src/domain/valueObjects/Tag.ts

export class Tag {
  private readonly name: string;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Tag name cannot be empty.");
    }
    this.name = name.trim();
  }

  // Value object equality is determined by value, not reference.
  equals(other: Tag): boolean {
    return other instanceof Tag && this.name === other.name;
  }

  // Getter for the tag name
  getName(): string {
    return this.name;
  }
}
