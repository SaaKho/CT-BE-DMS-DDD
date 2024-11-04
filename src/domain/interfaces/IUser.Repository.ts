// src/repository/interfaces/IUserRepository.ts
import { User } from "../../domain/entities/User";

export interface IUserRepository {
  findUserByUsername(username: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
}
