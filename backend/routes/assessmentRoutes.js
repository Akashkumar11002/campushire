import express from "express";
import {
  createAssessment,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
} from "../controllers/assessmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiters can create assessments and view results
router.post("/", protect, authorize("recruiter"), createAssessment);
router.get("/:id/results", protect, authorize("recruiter"), getAssessmentResults);

// Only students can start and submit
router.post("/:id/start", protect, authorize("student"), startAssessment);
router.post("/:id/submit", protect, authorize("student"), submitAssessment);

export default router;