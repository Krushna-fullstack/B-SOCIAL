import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));

// Routes Import
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
