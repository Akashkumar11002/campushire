import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Jobs dekhna sabke liye open hai — login zaroori nahi
router.get("/", getJobs);
router.get("/:id", getJobById);

// Job post karna sirf recruiter ka kaam hai — isliye protect + authorize dono lagaye
router.post("/", protect, authorize("recruiter"), createJob);
router.put("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

export default router;