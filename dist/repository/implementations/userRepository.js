"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRepository {
    async findUserByUsername(username) {
        const user = await schema_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.username, username))
            .execute();
        return user[0] || null;
    }
    async createUser(userData) {
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        console.log("Hashed password being stored: ", hashedPassword);
        const id = (0, uuid_1.v4)();
        await schema_1.db
            .insert(schema_1.users)
            .values({
            id,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || "User",
        })
            .execute();
    }
    async updateUser(id, username, email, password, role) {
        const updates = {};
        if (username)
            updates.username = username;
        if (email)
            updates.email = email;
        if (password)
            updates.password = await bcryptjs_1.default.hash(password, 10);
        if (role)
            updates.role = role;
        const updatedUser = await schema_1.db
            .update(schema_1.users)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning()
            .execute();
        return updatedUser[0] || null;
    }
    async deleteUser(userId) {
        const result = await schema_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).execute();
        return result?.rowCount ? result.rowCount > 0 : false;
    }
}
exports.UserRepository = UserRepository;
