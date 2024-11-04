// src/domain/interfaces/IUserRepository.ts

import { User } from "../../domain/entities/User";

export interface IUserRepository {
  fetchByName(username: string): Promise<User | null>;
  fetchById(userId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  delete(userId: string): Promise<boolean>;
  findPaginatedUsers(limit: number, offset: number): Promise<User[]>;
  countUsers(): Promise<number>;
}
