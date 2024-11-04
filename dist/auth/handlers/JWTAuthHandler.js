"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
class JwtAuthHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(username, password) {
        const user = await this.userRepository.findUserByUsername(username);
        if (!user) {
            console.log("User not found: ", username);
            throw new Error("Invalid username or password");
        }
        console.log("Stored hashed password: ", user.password);
        console.log("Plain password being compared: ", password);
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Password does not match for user: ", username);
            throw new Error("Invalid username or password");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
    async verify(token) {
        try {
            jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.JwtAuthHandler = JwtAuthHandler;
