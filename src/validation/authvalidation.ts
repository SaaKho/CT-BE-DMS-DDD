import { z } from "zod";

// Define the roles directly in the validation schema
const roles = ["user", "admin"] as const;

// User Registration Schema
export const registerSchema = z.object({
  id: z.string().uuid("Invalid UUID"), // Ensure the id is a valid UUID
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(roles) // Validate against the defined roles
    .optional(), // Role is optional
});

// User Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
