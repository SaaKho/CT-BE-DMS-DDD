// src/repository/implementations/UserRepository.ts
import { db, users } from "../../infrastructure/drizzle/schema";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";
import { User } from "../../domain/entities/User";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export class UserRepository implements IUserRepository {
  async findUserByUsername(username: string): Promise<User | null> {
    const userRecord = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = ${username.toLowerCase()}`)
      .execute();

    if (!userRecord[0]) return null;

    return new User(
      userRecord[0].id,
      userRecord[0].username,
      userRecord[0].email,
      userRecord[0].password,
      userRecord[0].role
    );
  }

  async createUser(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.getPassword(), 10);
    const id = uuidv4();

    await db
      .insert(users)
      .values({
        id,
        username: user.getUsername(),
        email: user.getEmail(),
        password: hashedPassword,
        role: user.getRole(),
      })
      .execute();

    user.initializeId(id); // Assign ID after creation
    return user;
  }

  async updateUser(user: User): Promise<User | null> {
    const updatedUserRecord = await db
      .update(users)
      .set({
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
      })
      .where(eq(users.id, user.getId()))
      .returning()
      .execute();

    if (!updatedUserRecord[0]) return null;

    return new User(
      updatedUserRecord[0].id,
      updatedUserRecord[0].username,
      updatedUserRecord[0].email,
      updatedUserRecord[0].password,
      updatedUserRecord[0].role
    );
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId)).execute();
    return result?.rowCount ? result.rowCount > 0 : false;
  }
}
