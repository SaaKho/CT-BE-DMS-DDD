// src/presentation/middleware/authMiddleware.ts
import { inject, injectable } from "inversify";
import { Response, NextFunction } from "express";
import { JwtAuthHandler } from "../../infrastructure/auth/handlers/JWTAuthHandler";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";
import { AuthenticatedRequest } from "../../presentation/middleware/roleMiddleware";
import { UserMapper } from "../../application/mappers/userMapper";
import { Logger } from "../../infrastructure/logging/logger"; // Add Logger

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("JwtAuthHandler") private readonly authHandler: JwtAuthHandler,
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("Logger") private readonly logger: Logger
  ) {}

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      this.logger.log(`Auth header received: ${authHeader}`); // Log the auth header

      if (!authHeader) {
        this.logger.error("No token provided");
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        this.logger.error("Token format invalid");
        return res.status(401).json({ message: "Token format invalid" });
      }

      // Verify token
      const isValidToken = await this.authHandler.verify(token);
      this.logger.log(`Token verification status: ${isValidToken}`); // Log token validity

      if (!isValidToken) {
        this.logger.error("Invalid token");
        return res.status(401).json({ message: "Invalid token" });
      }

      // Decode token to get the user ID
      const decodedToken = await this.authHandler.decode(token);
      this.logger.log(`Decoded token: ${JSON.stringify(decodedToken)}`); // Log the decoded token

      if (!decodedToken || !decodedToken.id) {
        this.logger.error("Invalid token payload");
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // Find user by decoded token ID
      const user = await this.userRepository.fetchById(decodedToken.id);
      this.logger.log(`User found: ${user ? user.getUsername : "None"}`); // Log user info

      if (!user) {
        this.logger.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // Map user to DTO and attach to request
      req.user = UserMapper.toDTO(user);
      this.logger.log(`User attached to request: ${JSON.stringify(req.user)}`); // Log the user attached to request

      next();
    } catch (error: any) {
      this.logger.error(`Authentication error: ${error.message}`); // Log any errors
      return res.status(500).json({
        message: "Authentication error",
        error: error.message,
      });
    }
  };
}
