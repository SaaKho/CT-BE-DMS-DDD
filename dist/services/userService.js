"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const entitiy_factory_1 = require("../factories/entitiy.factory");
class UserService {
    constructor(userRepository, authHandler) {
        this.userRepository = userRepository;
        this.authHandler = authHandler;
    }
    async registerNewUser(username, email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = entitiy_factory_1.EntityFactory.createUser(username, email, hashedPassword, "User");
        await this.userRepository.createUser(newUser);
    }
    async registerNewAdmin(username, email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newAdmin = entitiy_factory_1.EntityFactory.createUser(username, email, hashedPassword, "Admin");
        await this.userRepository.createUser(newAdmin);
    }
    async login(username, password) {
        return this.authHandler.login(username, password);
    }
    async updateUser(id, username, email, password, role) {
        const hashedPassword = password
            ? await bcryptjs_1.default.hash(password, 10)
            : undefined;
        return await this.userRepository.updateUser(id, username, email, hashedPassword, role);
    }
    async deleteUser(id) {
        const userDeleted = await this.userRepository.deleteUser(id);
        if (!userDeleted) {
            throw new Error("User not found");
        }
    }
}
exports.UserService = UserService;
