// src/config/dependencyConfig.ts
import { jwtAuthHandler } from "../config/authConfig";
import { AuthMiddleware } from "../../middleware/authMiddleware";

export const authMiddleware = new AuthMiddleware(jwtAuthHandler);
