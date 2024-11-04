// src/application/dtos/responses/userResponse.dto.ts

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterUserResponseDTO {
  message: string;
  user: UserResponseDTO;
}

export interface UpdateUserResponseDTO {
  message: string;
  user: UserResponseDTO;
}

export interface LoginResponseDTO {
  token: string;
  message: string;
}
