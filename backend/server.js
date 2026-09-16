import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "campushire-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("CampusHire API is running.");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CampusHire API listening on port ${PORT}`);
  connectDB();
});