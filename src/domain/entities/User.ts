// src/entities/User.ts

import { UserPassword } from "../valueObjects/user-password.vo";
import { Username } from "../valueObjects/username.vo";
import { Email } from "../valueObjects/user-email.vo";
import { Role } from "../valueObjects/user-role.vo";

export class User {
  private id: string;
  private username: Username;
  private email: Email;
  private password: UserPassword;
  private role: Role;

  constructor(
    id: string,
    username: Username,
    email: Email,
    password: UserPassword,
    role: Role = new Role("User") // Default role as User
  ) {
    if (!id || id.length === 0) {
      throw new Error("ID cannot be empty.");
    }
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  public initializeId(id: string): void {
    if (!this.id) {
      this.id = id;
    }
  }

  public getId(): string {
    return this.id;
  }

  public getUsername(): Username {
    return this.username;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): UserPassword {
    return this.password;
  }

  public getRole(): Role {
    return this.role;
  }

  public updateUsername(username: Username): void {
    this.username = username;
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public async updatePassword(newPassword: string): Promise<void> {
    this.password = await UserPassword.create(newPassword);
  }

  public updateRole(role: Role): void {
    this.role = role;
  }
}
