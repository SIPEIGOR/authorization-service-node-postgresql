import { Request, Response } from "express";
import {
  changePassword,
  getUserProfile,
  loginUser,
  refreshToken,
  registerUser,
} from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "An unknown error occurred" });
    }
  }
};
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const result = await changePassword(req.body);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const result = await getUserProfile(req.user.id);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "An unknown error occurred" });
    }
  }
};

import { getAllUsers } from "../services/auth.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const result = await refreshToken(req.body);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: "An unknown error occurred" });
    }
  }
};
