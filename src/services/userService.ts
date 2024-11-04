// src/services/userService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string = "user"
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
    })
    .returning();
};

export const authenticateUser = async (username: string, password: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .execute();

  const user = result[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

export const updateUser = async (
  id: string,
  username?: string,
  email?: string,
  password?: string,
  role?: string
) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const updatedUser = await db
    .update(users)
    .set({
      username: username || undefined,
      email: email || undefined,
      password: hashedPassword || undefined,
      role: role ? role.toLowerCase() : undefined,
    })
    .where(eq(users.id, id))
    .returning()
    .execute();

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  return await db.delete(users).where(eq(users.id, id)).execute();
};
