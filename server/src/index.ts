import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { Pool } from "pg";
import winston from "winston";
import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
