// src/routes/users/authRoutes.ts
import express, { Request, Response } from "express";
import { registerSchema, loginSchema } from "../../validation/authvalidation";
import { authMiddleware, authorizeRole } from "../../middleware/authMiddleware";
import {
  registerUser,
  authenticateUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

// Route for user registration
router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { username, email, password } = parsed.data;

  try {
    const newUser = await registerUser(username, email, password);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Route for admin registration (admin-only route)
router.post(
  "/register-admin",
  authMiddleware,
  authorizeRole("Admin"),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { username, email, password } = parsed.data;

    try {
      const newAdmin = await registerUser(username, email, password, "Admin");
      res
        .status(201)
        .json({ message: "Admin registered successfully", user: newAdmin });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: "Failed to register admin" });
    }
  }
);

// Route for user login
router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { username, password } = parsed.data;

  try {
    const token = await authenticateUser(username, password);
    res.json({ token });
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Route to update a user (accessible only to Admin)
router.put(
  "/update/:id",
  authMiddleware,
  authorizeRole("Admin"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    try {
      const updatedUser = await updateUser(id, username, email, password, role);
      if (updatedUser.length > 0) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// Route to delete a user (accessible only to Admin)
router.delete(
  "/deleteUser/:id",
  authMiddleware,
  authorizeRole("Admin"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      const deleteResult = await deleteUser(id);
      if (deleteResult.rowCount && deleteResult.rowCount > 0) {
        res.status(204).send(); // Success: No Content
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

export default router;
