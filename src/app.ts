import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/auth", authRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((error) => console.log(error));
