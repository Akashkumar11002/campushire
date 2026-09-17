import express from "express";
import { scheduleInterview, getMyInterviews } from "../controllers/interviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiters can schedule interviews
router.post("/", protect, authorize("recruiter"), scheduleInterview);

// Both students and recruiters can view their own interviews
router.get("/my", protect, getMyInterviews);

export default router;