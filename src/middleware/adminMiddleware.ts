import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./loginMiddleware";

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "Admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
};
