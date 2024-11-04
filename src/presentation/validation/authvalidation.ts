import { z } from "zod";

// Define the roles directly in the validation schema
const roles = ["User", "Admin"] as const;

// User Registration Schema
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// User Login Schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
