import { User } from "../../domain/entities/User";
import { UserDTO } from "../DTOs/user.dto";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      role: user.getRole(),
    };
  }

  static fromDTO(dto: UserDTO): User {
    return new User(dto.id, dto.username, dto.email, dto.role);
  }
}
