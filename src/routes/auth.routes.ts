import { Router } from "express";
import {
  changeUserPassword,
  getMe,
  getUsers,
  login,
  refresh,
  register,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", changeUserPassword);
router.get("/me", authMiddleware, getMe);
router.get("/users", getUsers);
router.post("/refresh", refresh);

export default router;
