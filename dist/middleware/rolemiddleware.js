"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
// Middleware to check if the user has the required role
const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res
                .status(401)
                .json({ message: "Access denied. No user authenticated." });
        }
        if (user.role !== requiredRole) {
            return res
                .status(403)
                .json({ message: `Access denied. ${requiredRole} role required.` });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
