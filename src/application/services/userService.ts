// src/application/services/UserService.ts

import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";
import { Logger } from "../../infrastructure/logging/logger";
import { Either, failure, ok } from "../../utils/monads";
import { RegisterUserDTO, UpdateUserDTO } from "../DTOs/requests/user.dto";
import {
  RegisterUserResponseDTO,
  UpdateUserResponseDTO,
  UserResponseDTO,
  LoginResponseDTO,
} from "../DTOs/responses/userResponse.dto";
import { User } from "../../domain/entities/User";
import { UserPassword } from "../../domain/valueObjects/user-password.vo";
import { Username } from "../../domain/valueObjects/username.vo";
import { Email } from "../../domain/valueObjects/user-email.vo";
import { Role } from "../../domain/valueObjects/user-role.vo";
import { UserFactory } from "../../domain/factories/userFactory";
import { inject, injectable } from "inversify";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("Logger") private readonly logger: Logger
  ) {}

  async registerNewUser(
    dto: RegisterUserDTO
  ): Promise<Either<string, RegisterUserResponseDTO>> {
    this.logger.log(`Registering new user: ${dto.username}`);

    const password = await UserPassword.create(dto.password);
    const username = new Username(dto.username);
    const email = new Email(dto.email);
    const role = new Role("User");

    const newUser = UserFactory.create(
      username.getValue(),
      email.getValue(),
      password,
      role.getValue()
    );

    try {
      const createdUser = await this.userRepository.create(newUser);
      this.logger.log(`User ${dto.username} registered successfully`);
      return ok({
        message: "User registered successfully",
        user: {
          id: createdUser.getId(),
          username: createdUser.getUsername().getValue(),
          email: createdUser.getEmail().getValue(),
          role: createdUser.getRole().getValue(),
        } as UserResponseDTO,
      });
    } catch (error: any) {
      this.logger.error(`Failed to register user: ${error.message}`);
      return failure(`Failed to register user: ${error.message}`);
    }
  }

  async registerNewAdmin(
    dto: RegisterUserDTO
  ): Promise<Either<string, RegisterUserResponseDTO>> {
    this.logger.log(`Registering new admin: ${dto.username}`);

    const password = await UserPassword.create(dto.password);
    const username = new Username(dto.username);
    const email = new Email(dto.email);
    const role = new Role("Admin");

    const newAdmin = UserFactory.create(
      username.getValue(),
      email.getValue(),
      password,
      role.getValue()
    );

    try {
      const createdAdmin = await this.userRepository.create(newAdmin);
      this.logger.log(`Admin ${dto.username} registered successfully`);
      return ok({
        message: "Admin registered successfully",
        user: {
          id: createdAdmin.getId(),
          username: createdAdmin.getUsername().getValue(),
          email: createdAdmin.getEmail().getValue(),
          role: createdAdmin.getRole().getValue(),
        } as UserResponseDTO,
      });
    } catch (error: any) {
      this.logger.error(`Failed to register admin: ${error.message}`);
      return failure(`Failed to register admin: ${error.message}`);
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<Either<string, LoginResponseDTO>> {
    this.logger.log(`Attempting login for username: ${username}`);

    const user: User | null = await this.userRepository.fetchByName(
      username.toLowerCase()
    );
    if (!user) {
      this.logger.error(`User not found: ${username}`);
      return failure("Invalid username or password");
    }

    const isPasswordValid = await user.getPassword().compare(password);
    if (!isPasswordValid) {
      this.logger.error(`Password mismatch for user: ${username}`);
      return failure("Invalid username or password");
    }

    const token = jwt.sign(
      {
        id: user.getId(),
        username: user.getUsername().getValue(),
        role: user.getRole().getValue(),
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return ok({
      token,
      message: "Login successful",
    });
  }

  // async updateUser(
  //   dto: UpdateUserDTO
  // ): Promise<Either<string, UpdateUserResponseDTO>> {
  //   this.logger.log(`Updating user with ID: ${dto.id}`);

  //   const password = dto.password
  //     ? await UserPassword.create(dto.password)
  //     : undefined;
  //   const username = dto.username ? new Username(dto.username) : undefined;
  //   const email = dto.email ? new Email(dto.email) : undefined;
  //   const role = dto.role ? new Role(dto.role) : new Role("User");

  //   const existingUser = await this.userRepository.fetchById(dto.id);
  //   if (!existingUser) {
  //     return failure("User not found");
  //   }

  //   const user = UserFactory.createExisting(
  //     dto.id,
  //     username ? username.getValue() : existingUser.getUsername().getValue(),
  //     email ? email.getValue() : existingUser.getEmail().getValue(),
  //     password || existingUser.getPassword(),
  //     role.getValue()
  //   );

  //   try {
  //     const updatedUser = await this.userRepository.update(user);
  //     if (!updatedUser) {
  //       return failure("User not found");
  //     }
  //     this.logger.log(`User with ID ${dto.id} updated successfully`);
  //     return ok({
  //       message: "User updated successfully",
  //       user: {
  //         id: updatedUser.getId(),
  //         username: updatedUser.getUsername().getValue(),
  //         email: updatedUser.getEmail().getValue(),
  //         role: updatedUser.getRole().getValue(),
  //       } as UpdateUserResponseDTO,
  //     });
  //   } catch (error: any) {
  //     this.logger.error(
  //       `Failed to update user with ID ${dto.id}: ${error.message}`
  //     );
  //     return failure(`Failed to update user: ${error.message}`);
  //   }
  // }
  async updateUser(
    dto: UpdateUserDTO
  ): Promise<Either<string, UpdateUserResponseDTO>> {
    this.logger.log(`Updating user with ID: ${dto.id}`);

    const password = dto.password
      ? await UserPassword.create(dto.password)
      : undefined;
    const username = dto.username ? new Username(dto.username) : undefined;
    const email = dto.email ? new Email(dto.email) : undefined;
    const role = dto.role ? new Role(dto.role) : new Role("User");

    const existingUser = await this.userRepository.fetchById(dto.id);
    if (!existingUser) {
      return failure("User not found");
    }

    const user = UserFactory.createExisting(
      dto.id,
      username ? username.getValue() : existingUser.getUsername().getValue(),
      email ? email.getValue() : existingUser.getEmail().getValue(),
      password || existingUser.getPassword(),
      role.getValue()
    );

    try {
      const updatedUser = await this.userRepository.update(user);
      if (!updatedUser) {
        return failure("User not found");
      }
      this.logger.log(`User with ID ${dto.id} updated successfully`);
      return ok({
        message: "User updated successfully",
        user: {
          id: updatedUser.getId(),
          username: updatedUser.getUsername().getValue(),
          email: updatedUser.getEmail().getValue(),
          role: updatedUser.getRole().getValue(),
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to update user with ID ${dto.id}: ${error.message}`
      );
      return failure(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<Either<string, void>> {
    this.logger.log(`Deleting user with ID: ${id}`);
    try {
      const userDeleted = await this.userRepository.delete(id);
      if (!userDeleted) {
        this.logger.error(
          `Failed to delete user with ID ${id}: User not found`
        );
        return failure("User not found");
      }
      this.logger.log(`User with ID ${id} deleted successfully`);
      return ok(undefined);
    } catch (error: any) {
      this.logger.error(
        `Failed to delete user with ID ${id}: ${error.message}`
      );
      return failure(`Failed to delete user: ${error.message}`);
    }
  }
}
