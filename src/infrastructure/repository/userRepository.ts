// src/repository/implementations/UserRepository.ts

import { db, users } from "../../infrastructure/drizzle/schema";
import { IUserRepository } from "../../domain/interfaces/IUser.Repository";
import { User } from "../../domain/entities/User";
import { UserPassword } from "../../domain/valueObjects/user-password.vo";
import { Username } from "../../domain/valueObjects/username.vo";
import { Email } from "../../domain/valueObjects/user-email.vo";
import { Role } from "../../domain/valueObjects/user-role.vo";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  // Fetch user by username
  async fetchByName(username: string): Promise<User | null> {
    const userRecord = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = ${username.toLowerCase()}`)
      .execute();

    if (!userRecord[0]) return null;

    const userPassword = UserPassword.fromHashed(userRecord[0].password);
    return new User(
      userRecord[0].id,
      new Username(userRecord[0].username),
      new Email(userRecord[0].email),
      userPassword,
      new Role(userRecord[0].role)
    );
  }

  // Fetch user by ID
  async fetchById(userId: string): Promise<User | null> {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!userRecord[0]) return null;

    const userPassword = UserPassword.fromHashed(userRecord[0].password);
    return new User(
      userRecord[0].id,
      new Username(userRecord[0].username),
      new Email(userRecord[0].email),
      userPassword,
      new Role(userRecord[0].role)
    );
  }

  // Create a new user
  async create(user: User): Promise<User> {
    const id = uuidv4();
    const hashedPassword = user.getPassword().getHashed(); // Get the hashed password from UserPassword

    await db
      .insert(users)
      .values({
        id,
        username: user.getUsername().getValue(), // Extract raw value from Username
        email: user.getEmail().getValue(), // Extract raw value from Email
        password: hashedPassword,
        role: user.getRole().getValue(), // Extract raw value from Role
      })
      .execute();

    user.initializeId(id);
    return user;
  }

  // Update an existing user
  async update(user: User): Promise<User | null> {
    const hashedPassword = user.getPassword().getHashed(); // Get the hashed password from UserPassword

    const updatedUserRecord = await db
      .update(users)
      .set({
        username: user.getUsername().getValue(), // Extract raw value from Username
        email: user.getEmail().getValue(), // Extract raw value from Email
        password: hashedPassword,
        role: user.getRole().getValue(), // Extract raw value from Role
      })
      .where(eq(users.id, user.getId()))
      .returning()
      .execute();

    if (!updatedUserRecord[0]) return null;

    const userPassword = UserPassword.fromHashed(updatedUserRecord[0].password);
    return new User(
      updatedUserRecord[0].id,
      new Username(updatedUserRecord[0].username),
      new Email(updatedUserRecord[0].email),
      userPassword,
      new Role(updatedUserRecord[0].role)
    );
  }

  // Delete a user by ID
  async delete(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId)).execute();
    return result?.rowCount ? result.rowCount > 0 : false;
  }

  // Find paginated users
  async findPaginatedUsers(limit: number, offset: number): Promise<User[]> {
    const paginatedData = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .execute();

    return paginatedData.map(
      (userRecord) =>
        new User(
          userRecord.id,
          new Username(userRecord.username),
          new Email(userRecord.email),
          UserPassword.fromHashed(userRecord.password), // Use UserPassword for each user
          new Role(userRecord.role)
        )
    );
  }

  // Count total users
  async countUsers(): Promise<number> {
    const totalItemsQuery = await db.select().from(users);
    return totalItemsQuery.length;
  }
}
