// src/factories/UserFactory.ts
import { User } from "../entities/User";

export class UserFactory {
  static create(
    username: string,
    email: string,
    password: string,
    role: string = "User"
  ): User {
    return new User("", username, email, password, role);
  }

  static createExisting(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string = "User"
  ): User {
    const user = new User(id, username, email, password, role);
    // user.setId(id);
    user.initializeId(id);
    return user;
  }
}
