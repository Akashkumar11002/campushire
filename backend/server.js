import express from "express";
import "dotenv/config";

import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";


import http from "http";
import { initializeSocket } from "./config/socket.js";




const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/companies", companyRoutes);
app.use("/api/resumes", resumeRoutes);

app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/students", studentProfileRoutes);

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


const httpServer = http.createServer(app);
initializeSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`CampusHire API listening on port ${PORT}`);
  connectDB();
});