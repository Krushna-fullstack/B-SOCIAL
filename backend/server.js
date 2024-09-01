import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
