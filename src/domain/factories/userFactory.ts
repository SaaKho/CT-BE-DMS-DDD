// src/domain/factories/UserFactory.ts

import { User } from "../entities/User";
import { UserPassword } from "../valueObjects/user-password.vo";
import { Username } from "../valueObjects/username.vo";
import { Email } from "../valueObjects/user-email.vo";
import { Role } from "../valueObjects/user-role.vo";

export class UserFactory {
  static create(
    username: string,
    email: string,
    password: UserPassword,
    role: string = "User"
  ): User {
    const userUsername = new Username(username);
    const userEmail = new Email(email);
    const userRole = new Role(role);

    return new User(
      "", // ID will be set later
      userUsername,
      userEmail,
      password,
      userRole
    );
  }

  static createExisting(
    id: string,
    username: string,
    email: string,
    password: UserPassword,
    role: string
  ): User {
    const userUsername = new Username(username);
    const userEmail = new Email(email);
    const userRole = new Role(role);

    return new User(id, userUsername, userEmail, password, userRole);
  }
}
