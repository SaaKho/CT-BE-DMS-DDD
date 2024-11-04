import bcrypt from "bcryptjs";

export class UserPassword {
  private readonly hashedPassword: string;

  private constructor(hashedPassword: string) {
    this.hashedPassword = hashedPassword;
  }

  static async create(password: string): Promise<UserPassword> {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return new UserPassword(hashedPassword);
  }

  static fromHashed(hashedPassword: string): UserPassword {
    return new UserPassword(hashedPassword);
  }

  async compare(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashedPassword);
  }

  getHashed(): string {
    return this.hashedPassword;
  }
}
