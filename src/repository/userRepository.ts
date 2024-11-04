import { db, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  async findUserByUsername(username: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    role: string = "User"
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    return await db
      .insert(users)
      .values({
        id,
        username,
        email,
        password: hashedPassword,
        role,
      })
      .returning();
  }
  async updateUser(
    id: string,
    username?: string,
    email?: string,
    password?: string,
    role?: string
  ) {
    return await db
      .update(users)
      .set({
        username: username || undefined,
        email: email || undefined,
        password: password || undefined,
        role: role || undefined,
      })
      .where(eq(users.id, id))
      .returning();
  }

  async deleteUser(id: string) {
    return await db.delete(users).where(eq(users.id, id)).execute();
  }
}
