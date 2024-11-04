export class Username {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.length === 0) {
      throw new Error("Username cannot be empty.");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
