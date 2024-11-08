"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const userController_1 = require("../../controllers/userController");
const userService_1 = require("../../services/userService");
const userRepository_1 = require("../../repository/implementations/userRepository");
const JWTAuthHandler_1 = require("../../auth/handlers/JWTAuthHandler");
const router = express_1.default.Router();
const userRepository = new userRepository_1.UserRepository();
const authHandler = new JWTAuthHandler_1.JwtAuthHandler(userRepository);
const userService = new userService_1.UserService(userRepository, authHandler);
userController_1.UserController.setUserService(userService);
router.post("/register", userController_1.UserController.registerNewUser);
router.post("/registerAdmin", authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)("Admin"), userController_1.UserController.registerNewAdmin);
router.post("/login", userController_1.UserController.login);
router.put("/update/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)("Admin"), userController_1.UserController.updateUser);
router.delete("/delete/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)("Admin"), userController_1.UserController.deleteUser);
exports.default = router;
