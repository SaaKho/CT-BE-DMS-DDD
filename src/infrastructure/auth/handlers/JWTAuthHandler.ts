// src/infrastructure/auth/handlers/JWTAuthHandler.ts
import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import { IAuthHandler } from "../interfaces/IAuthHandler";
import { IUserRepository } from "../../../domain/interfaces/IUser.Repository";
import { Logger } from "../../logging/logger";
import { UserPassword } from "../../../domain/valueObjects/user-password.vo";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

@injectable()
export class JwtAuthHandler implements IAuthHandler {
  // Inject the IUserRepository and Logger
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("Logger") private readonly logger: Logger // Inject Logger
  ) {}

  async login(username: string, password: string): Promise<string> {
    this.logger.log(`Login attempt for username: ${username}`);

    const user = await this.userRepository.fetchByName(username);
    if (!user) {
      this.logger.error("Invalid username");
      throw new Error("Invalid username or password");
    }

    // Use UserPassword.compare() for password validation
    const passwordMatch = await user.getPassword().compare(password);
    if (!passwordMatch) {
      this.logger.error("Invalid password");
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.getId(), username: user.getUsername(), role: user.getRole() },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    this.logger.log(`Generated JWT for user: ${username}`);
    return token;
  }

  async verify(token: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying token: ${token}`);
      jwt.verify(token, JWT_SECRET);
      this.logger.log("Token verification successful");
      return true;
    } catch (error: any) {
      this.logger.error(`Token verification failed: ${error.message}`);
      return false;
    }
  }

  async decode(
    token: string
  ): Promise<{ id: string; username: string; role: string }> {
    try {
      this.logger.log(`Decoding token: ${token}`);
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
        role: string;
      };
      this.logger.log(`Token decoded: ${JSON.stringify(decoded)}`);
      return decoded;
    } catch (error: any) {
      this.logger.error(`Token decoding failed: ${error.message}`);
      throw error;
    }
  }
}
