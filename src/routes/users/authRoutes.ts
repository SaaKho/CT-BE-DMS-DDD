import express from "express";
import { authMiddleware,authorizeRole } from "../../middleware/authMiddleware";
import { UserController } from "../../controllers/userController";

const router = express.Router();

// Public route for user registration (no middleware)
router.post("/register", UserController.registerNewUser);

// Route for admin registration (only Admins can register new admins)
router.post(
  "/registerAdmin",
  authMiddleware, // Authenticated users only
  (req, res, next) => authorizeRole("Admin")(req, res, next), // Only Admins
  UserController.registerNewAdmin
);

// Route for user login (no middleware)
router.post("/login", UserController.login);

// Route for updating a user (requires authentication and role authorization)
router.put(
  "/update/:id",
  authMiddleware, // Authenticated users only
  (req, res, next) => authorizeRole("Admin")(req, res, next), // Only Admins can update users
  UserController.updateUser
);

// Route for deleting a user (requires authentication and role authorization)
router.delete(
  "/deleteUser/:id",
  authMiddleware, // Authenticated users only
  (req, res, next) => authorizeRole("Admin")(req, res, next), // Only Admins can delete users
  UserController.deleteUser
);

export default router;
