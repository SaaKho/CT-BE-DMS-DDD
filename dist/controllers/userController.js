"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const authvalidation_1 = require("../validation/authvalidation");
class UserController {
    static setUserService(service) {
        this.userService = service;
    }
}
exports.UserController = UserController;
_a = UserController;
UserController.registerNewUser = async (req, res) => {
    const validation = authvalidation_1.registerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.errors,
        });
    }
    const { username, email, password } = req.body;
    try {
        await _a.userService.registerNewUser(username, email, password);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to register user" });
    }
};
UserController.registerNewAdmin = async (req, res) => {
    const validation = authvalidation_1.registerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.errors,
        });
    }
    const { username, email, password } = req.body;
    try {
        await _a.userService.registerNewAdmin(username, email, password);
        res.status(201).json({ message: "Admin registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to register admin" });
    }
};
UserController.login = async (req, res) => {
    const validation = authvalidation_1.loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.errors,
        });
    }
    const { username, password } = req.body;
    try {
        const token = await _a.userService.login(username, password);
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid username or password" });
    }
};
UserController.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    try {
        const updatedUser = await _a.userService.updateUser(id, username, email, password, role);
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user" });
    }
};
UserController.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await _a.userService.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};
