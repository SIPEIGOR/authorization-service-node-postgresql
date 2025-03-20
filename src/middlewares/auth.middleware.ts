import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
const userRepository = AppDataSource.getRepository(User);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };

    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (user.accessToken !== token) {
      res
        .status(403)
        .json({ message: "Token is outdated, please log in again." });
      return;
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const generateAccessToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
