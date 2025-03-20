import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import { generateToken } from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({ email, password: hashedPassword });

  await userRepository.save(user);
  return { message: "User created" };
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findOneBy({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.email);
  return { token };
};
