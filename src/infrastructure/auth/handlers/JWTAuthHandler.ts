// src/auth/implementations/JwtAuthHandler.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IAuthHandler } from "../interfaces/IAuthHandler";
import { IUserRepository } from "../../../domain/interfaces/IUser.Repository";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export class JwtAuthHandler implements IAuthHandler {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw new Error("Invalid username or password");

    const passwordMatch = await bcrypt.compare(password, user.getPassword());
    if (!passwordMatch) throw new Error("Invalid username or password");

    return jwt.sign(
      { id: user.getId(), username: user.getUsername(), role: user.getRole() },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  async verify(token: string): Promise<boolean> {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  async decode(
    token: string
  ): Promise<{ id: string; username: string; role: string }> {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };
    return decoded;
  }
}
