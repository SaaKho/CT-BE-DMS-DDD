import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/userRepository";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const userRepository = new UserRepository();

export class UserService {
  // Method to register a new user
  async registerNewUser(username: string, email: string, password: string) {
    const newUser = await userRepository.createUser(username, email, password);
    return newUser;
  }

  // Method to register a new admin
  async registerNewAdmin(username: string, email: string, password: string) {
    const newAdmin = await userRepository.createUser(
      username,
      email,
      password,
      "Admin"
    );
    return newAdmin;
  }

  // Method to login a user
  async login(username: string, password: string) {
    const result = await userRepository.findUserByUsername(username);
    const user = result[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  }

  // Method to update a user
  async updateUser(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string
  ) {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await userRepository.updateUser(
      id,
      username,
      email,
      hashedPassword || "",
      role ? role.toLowerCase() : "User"
    );

    return updatedUser;
  }

  // Method to delete a user
  async deleteUser(id: string) {
    const deleteResult = await userRepository.deleteUser(id);

    if (!deleteResult.rowCount || deleteResult.rowCount === 0) {
      throw new Error("User not found");
    }

    return deleteResult;
  }
}
