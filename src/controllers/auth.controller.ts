import { Request, Response } from "express";
import {
  changePassword,
  getUserProfile,
  loginUser,
  refreshToken,
  registerUser,
} from "../services/auth.service";

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувача створено
 *       400:
 *         description: Помилка валідації або інша
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Авторизація користувача
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Невірні облікові дані
 */
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

/**
 * @swagger
 * /change-password:
 *   put:
 *     summary: Зміна пароля користувача
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пароль змінено успішно
 *       400:
 *         description: Невірні дані або помилка
 */
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

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Отримати профіль поточного користувача
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       401:
 *         description: Неавторизовано
 *       404:
 *         description: Користувача не знайдено
 */
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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати список всіх користувачів
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Список користувачів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *       500:
 *         description: Помилка сервера
 */
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

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Отримати нові access та refresh токени
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Нові токени
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Невалідний токен
 */
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
