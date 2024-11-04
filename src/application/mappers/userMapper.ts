// src/application/mappers/UserMapper.ts

import { User } from "../../domain/entities/User";
import { UserDTO } from "../DTOs/requests/user.dto";
import { Username } from "../../domain/valueObjects/username.vo";
import { Email } from "../../domain/valueObjects/user-email.vo";
import { Role } from "../../domain/valueObjects/user-role.vo";
import { UserPassword } from "../../domain/valueObjects/user-password.vo";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.getId(),
      username: user.getUsername().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    };
  }

  static fromDTO(dto: UserDTO): User {
    const username = new Username(dto.username);
    const email = new Email(dto.email);
    const role = new Role(dto.role);

    return new User(
      dto.id,
      username,
      email,
      UserPassword.fromHashed("defaultHashedPassword"),
      role
    );
  }
}
