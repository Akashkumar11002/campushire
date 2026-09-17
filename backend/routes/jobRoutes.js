import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { getJobMatch, getRecommendedJobs } from "../controllers/jobMatchController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/recommended", protect, authorize("student"), getRecommendedJobs);
router.get("/:id", getJobById);
router.get("/:jobId/match", protect, authorize("student"), getJobMatch);

router.post("/", protect, authorize("recruiter"), createJob);
router.put("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

export default router;