// src/auth/config/authConfig.ts
import { JwtAuthHandler } from "../handlers/JWTAuthHandler";
import { UserRepository } from "../../repository/implementations/userRepository";

const userRepository = new UserRepository();
const jwtAuthHandler = new JwtAuthHandler(userRepository);

export { jwtAuthHandler };
