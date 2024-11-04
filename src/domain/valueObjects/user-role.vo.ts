export class Role {
  private readonly value: string;
  private static readonly validRoles = ["User", "Admin"];

  constructor(value: string) {
    if (!Role.validRoles.includes(value)) {
      throw new Error(
        `Invalid role. Allowed values: ${Role.validRoles.join(", ")}`
      );
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }
}
