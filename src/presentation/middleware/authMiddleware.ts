// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { IAuthHandler } from "../../infrastructure/auth/interfaces/IAuthHandler";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; username: string; role: string };
}

export class AuthMiddleware {
  private authHandler: IAuthHandler;

  constructor(authHandler: IAuthHandler) {
    this.authHandler = authHandler;
  }

  public authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });

    const token = authHeader.split(" ")[1];
    const isValid = await this.authHandler.verify(token);
    if (!isValid)
      return res.status(403).json({ message: "Invalid or expired token" });

    const user = await this.authHandler.decode(token);
    req.user = user;
    next();
  };
}
