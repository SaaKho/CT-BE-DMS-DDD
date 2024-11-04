// src/application/dtos/UserDTO.ts
export interface UserDTO {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface LoginResponseDTO {
  token: string;
}
