import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import {
  ChangePasswordDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from "../interfaces/auth.interface";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth.middleware";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (data: RegisterUserDTO) => {
  const { email, password, firstName, lastName } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });
  await userRepository.save(user);

  return { message: "User created" };
};

export const loginUser = async (data: LoginUserDTO) => {
  const { email, password } = data;
  const user = await userRepository.findOneBy({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken(user.id, user.email);

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await userRepository.save(user);

  return { accessToken, refreshToken };
};

export const changePassword = async (data: ChangePasswordDTO) => {
  const { email, oldPassword, newPassword } = data;
  const user = await userRepository.findOneBy({ email });

  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new Error("Invalid credentials");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await userRepository.save(user);

  return { message: "Password updated successfully" };
};

export const getUserProfile = async (userId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const getAllUsers = async () => {
  const users = await userRepository.find({
    select: ["id", "email", "firstName", "lastName"],
  });

  return users;
};

export const refreshToken = async (data: { refreshToken: string }) => {
  const { refreshToken } = data;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    ) as {
      id: number;
      email: string;
    };

    const user = await userRepository.findOneBy({ id: decoded.id });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user.id, user.email);
    const newRefreshToken = generateRefreshToken(user.id, user.email);

    user.accessToken = newAccessToken;
    user.refreshToken = newRefreshToken;
    await userRepository.save(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
