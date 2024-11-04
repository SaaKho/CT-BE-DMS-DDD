// src/presentation/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../../application/services/userService";
import { registerSchema, loginSchema } from "../validation/authvalidation";
import { AuthenticatedRequest } from "../../presentation/middleware/roleMiddleware";
import {
  RegisterUserDTO,
  UpdateUserDTO,
} from "../../application/DTOs/requests/user.dto";
import {
  RegisterUserResponseDTO,
  UpdateUserResponseDTO,
  LoginResponseDTO,
} from "../../application/DTOs/responses/userResponse.dto";
import { Either, Ok, Failure } from "../../utils/monads";

export class UserController {
  public static userService: UserService;

  static setUserService(service: UserService) {
    this.userService = service;
  }

  static registerNewUser = async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const dto: RegisterUserDTO = req.body;

    try {
      const result: Either<string, RegisterUserResponseDTO> =
        await this.userService.registerNewUser(dto);

      if (result instanceof Failure) {
        return res.status(500).json({ message: result.value });
      }

      const response = result.value as RegisterUserResponseDTO;
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Failed to register user" });
    }
  };

  static registerNewAdmin = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const dto: RegisterUserDTO = req.body;

    try {
      const result: Either<string, RegisterUserResponseDTO> =
        await this.userService.registerNewAdmin(dto);

      if (result instanceof Failure) {
        return res.status(500).json({ message: result.value });
      }

      const response = result.value as RegisterUserResponseDTO;
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Failed to register admin" });
    }
  };

  static login = async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const { username, password } = req.body;

    try {
      const result: Either<string, LoginResponseDTO> =
        await this.userService.login(username, password);

      if (result instanceof Failure) {
        return res.status(401).json({ message: result.value });
      }

      const response = result.value as LoginResponseDTO;
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error during login:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  static updateUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const dto: UpdateUserDTO = { id, ...req.body };

    try {
      const result: Either<string, UpdateUserResponseDTO> =
        await this.userService.updateUser(dto);

      if (result instanceof Failure) {
        return res.status(500).json({ message: result.value });
      }

      const response = result.value as UpdateUserResponseDTO;
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update user" });
    }
  };

  static deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      const result = await this.userService.deleteUser(id);

      if (result instanceof Failure) {
        return res.status(500).json({ message: result.value });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete user" });
    }
  };
}
