import express from "express";
import { uploadResume, getMyResumes, deleteResume } from "../controllers/resumeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Only students can upload/manage resumes
router.post("/upload", protect, authorize("student"), upload.single("resume"), uploadResume);
router.get("/my", protect, authorize("student"), getMyResumes);
router.delete("/:id", protect, authorize("student"), deleteResume);

export default router;