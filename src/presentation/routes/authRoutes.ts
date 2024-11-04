// src/routes/authRoutes.ts
import express from "express";
import { AuthMiddleware } from "../../presentation/middleware/authMiddleware";
import { UserController } from "../../presentation/controllers/userController";
import { JwtAuthHandler } from "../../infrastructure/auth/handlers/JWTAuthHandler";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { ConsoleLogger } from "../../infrastructure/logging/consoleLogger";
import { UserService } from "../../application/services/userService";

const router = express.Router();

// Manually resolve dependencies
const userRepository = new UserRepository();
const logger = new ConsoleLogger();
const userService = new UserService(userRepository, logger);
const authHandler = new JwtAuthHandler(userRepository, logger);

// Assign the manually injected service to UserController
UserController.setUserService(userService);

// Instantiate authMiddleware with both JwtAuthHandler and UserRepository
const authMiddleware = new AuthMiddleware(authHandler, userRepository, logger); // Pass all three dependencies

// Route definitions
router.post("/register", UserController.registerNewUser);

router.post("/login", UserController.login);

router.put(
  "/updateProfile",
  authMiddleware.authenticate,
  UserController.updateUser
);

router.delete(
  "/deleteAccount",
  authMiddleware.authenticate,
  UserController.deleteUser
);

export default router;
