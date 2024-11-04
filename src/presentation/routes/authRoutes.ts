// src/routes/users/authRoutes.ts
import express from "express";
import { AuthMiddleware } from "../../presentation/middleware/authMiddleware"; // Import the class, not an instance
import { roleMiddleware } from "../../presentation/middleware/roleMiddleware";
import { UserController } from "../controllers/userController";
import { UserService } from "../../application/services/userService";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { JwtAuthHandler } from "../../infrastructure/auth/handlers/JWTAuthHandler";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";

const router = express.Router();

// Set up DI for UserService with property injection
const userService = new UserService();
userService.userRepository = new UserRepository();
userService.authHandler = new JwtAuthHandler(userService.userRepository);
userService.logger = new ConsoleLogger();
UserController.setUserService(userService);

// Instantiate the AuthMiddleware with the appropriate auth handler
const authHandler = new JwtAuthHandler(userService.userRepository);
const authMiddleware = new AuthMiddleware(authHandler);

// Routes
router.post("/register", UserController.registerNewUser);
router.post(
  "/registerAdmin",
  authMiddleware.authenticate,
  roleMiddleware(["Admin"]), // Role-based access control
  UserController.registerNewAdmin
);
router.post("/login", UserController.login);

router.put(
  "/updateUser/:id",
  authMiddleware.authenticate,
  roleMiddleware(["Admin"]), // Role-based access control
  UserController.updateUser
);
router.delete(
  "/deleteUser/:id",
  authMiddleware.authenticate,
  // roleMiddleware(["Admin"]), // Role-based access control
  UserController.deleteUser
);

export default router;
