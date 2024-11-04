// src/application/services/UserService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";
import { IAuthHandler } from "../../infrastructure/auth/interfaces/IAuthHandler";
import { User } from "../../domain/entities/User";
import { UserFactory } from "../../domain/factories/userFactory";
import { Logger } from "../../infrastructure/logging/logger";
import { Either, failure, ok } from "../../utils/monads";
import {
  RegisterUserDTO,
  UpdateUserDTO,
  UserDTO,
  LoginResponseDTO,
} from "../DTOs/user.dto";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export class UserService {
  private _userRepository!: IUserRepository;
  private _authHandler!: IAuthHandler;
  private _logger!: Logger;

  set userRepository(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  set authHandler(authHandler: IAuthHandler) {
    this._authHandler = authHandler;
  }

  set logger(logger: Logger) {
    this._logger = logger;
  }

  async registerNewUser(
    dto: RegisterUserDTO
  ): Promise<Either<string, UserDTO>> {
    this._logger.log(`Registering new user: ${dto.username}`);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = UserFactory.create(
      dto.username,
      dto.email,
      hashedPassword,
      "User"
    );

    try {
      const createdUser = await this._userRepository.createUser(newUser);
      this._logger.log(`User ${dto.username} registered successfully`);
      return ok({
        id: createdUser.getId(),
        username: createdUser.getUsername(),
        email: createdUser.getEmail(),
        role: createdUser.getRole(),
      });
    } catch (error: any) {
      this._logger.error(`Failed to register user: ${error.message}`);
      return failure(`Failed to register user: ${error.message}`);
    }
  }

  async registerNewAdmin(
    dto: RegisterUserDTO
  ): Promise<Either<string, UserDTO>> {
    this._logger.log(`Registering new admin: ${dto.username}`);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newAdmin = UserFactory.create(
      dto.username,
      dto.email,
      hashedPassword,
      "Admin"
    );

    try {
      const createdAdmin = await this._userRepository.createUser(newAdmin);
      this._logger.log(`Admin ${dto.username} registered successfully`);
      return ok({
        id: createdAdmin.getId(),
        username: createdAdmin.getUsername(),
        email: createdAdmin.getEmail(),
        role: createdAdmin.getRole(),
      });
    } catch (error: any) {
      this._logger.error(`Failed to register admin: ${error.message}`);
      return failure(`Failed to register admin: ${error.message}`);
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<Either<string, LoginResponseDTO>> {
    const user: User | null = await this._userRepository.findUserByUsername(
      username.toLowerCase()
    );

    if (!user) {
      this._logger.error(`User not found: ${username}`);
      return failure("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) {
      this._logger.error(`Password mismatch for user: ${username}`);
      return failure("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.getId(), username: user.getUsername(), role: user.getRole() },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    this._logger.log(`User logged in successfully: ${username}`);
    return ok({ token });
  }

  async updateUser(
    dto: UpdateUserDTO
  ): Promise<Either<string, UserDTO | null>> {
    this._logger.log(`Updating user with ID: ${dto.id}`);
    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;
    const user = UserFactory.createExisting(
      dto.id,
      dto.username || "",
      dto.email || "",
      hashedPassword || "",
      dto.role || "User"
    );

    try {
      const updatedUser = await this._userRepository.updateUser(user);
      if (!updatedUser) {
        return ok(null);
      }
      this._logger.log(`User with ID ${dto.id} updated successfully`);
      return ok({
        id: updatedUser.getId(),
        username: updatedUser.getUsername(),
        email: updatedUser.getEmail(),
        role: updatedUser.getRole(),
      });
    } catch (error: any) {
      this._logger.error(
        `Failed to update user with ID ${dto.id}: ${error.message}`
      );
      return failure(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<Either<string, void>> {
    this._logger.log(`Deleting user with ID: ${id}`);
    try {
      const userDeleted = await this._userRepository.deleteUser(id);
      if (!userDeleted) {
        this._logger.error(
          `Failed to delete user with ID ${id}: User not found`
        );
        return failure("User not found");
      }
      this._logger.log(`User with ID ${id} deleted successfully`);
      return ok(undefined); // Returning ok with no value
    } catch (error: any) {
      this._logger.error(
        `Failed to delete user with ID ${id}: ${error.message}`
      );
      return failure(`Failed to delete user: ${error.message}`);
    }
  }
}
