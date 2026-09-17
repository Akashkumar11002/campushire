import express from "express";
import { uploadResume, getMyResumes, deleteResume } from "../controllers/resumeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";
import { analyzeResumeById, getResumeAnalysis } from "../controllers/resumeAnalysisController.js";

const router = express.Router();

// Only students can upload/manage resumes
router.post("/upload", protect, authorize("student"), upload.single("resume"), uploadResume);
router.get("/my", protect, authorize("student"), getMyResumes);
router.delete("/:id", protect, authorize("student"), deleteResume);
router.post("/:id/analyze", protect, authorize("student"), analyzeResumeById);
router.get("/:id/analysis", protect, authorize("student"), getResumeAnalysis);

export default router;