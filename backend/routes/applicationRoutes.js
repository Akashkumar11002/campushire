import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sirf student apply kar sake
router.post("/:jobId", protect, authorize("student"), applyToJob);
router.get("/my", protect, authorize("student"), getMyApplications);

// Sirf recruiter apni job ki applications dekhe aur status update kare
router.get("/job/:jobId", protect, authorize("recruiter"), getApplicationsForJob);
router.put("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);

export default router;