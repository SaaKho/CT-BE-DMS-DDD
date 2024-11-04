// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../../application/services/userService";
import { registerSchema, loginSchema } from "../validation/authvalidation";
import { AuthenticatedRequest } from "../../presentation/middleware/authMiddleware";
import {
  RegisterUserDTO,
  UpdateUserDTO,
} from "../../application/DTOs/user.dto";

export class UserController {
  private static userService: UserService;

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
    const { username, email, password } = req.body;
    const dto: RegisterUserDTO = { username, email, password };

    try {
      const result = await this.userService.registerNewUser(dto);
      if ((result as any).isFailure()) {
        return res.status(500).json({ message: (result as any).error });
      }
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
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
    const { username, email, password } = req.body;
    const dto: RegisterUserDTO = { username, email, password };

    try {
      const result = await this.userService.registerNewAdmin(dto);
      if ((result as any).isFailure()) {
        return res.status(500).json({ message: (result as any).error });
      }
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register admin" });
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
      const result = await this.userService.login(username, password);
      if ((result as any).isFailure()) {
        return res.status(401).json({ message: (result as any).error });
      }
      res.status(200).json({
        message: "Login successful",
        token: (result as any).value.token,
      });
    } catch (error) {
      res.status(401).json({ message: "Invalid username or password" });
    }
  };

  static updateUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    const dto: UpdateUserDTO = { id, username, email, password, role };

    try {
      const result = await this.userService.updateUser(dto);
      if ((result as any).isFailure()) {
        return res.status(500).json({ message: (result as any).error });
      }
      res.status(200).json({
        message: "User updated successfully",
        user: (result as any).value,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  };

  static deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
      const result = await this.userService.deleteUser(id);
      if ((result as any).isFailure()) {
        return res.status(500).json({ message: (result as any).error });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  };
}
