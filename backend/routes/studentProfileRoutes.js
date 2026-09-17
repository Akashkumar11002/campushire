import express from "express";
import {
  upsertMyProfile,
  getMyProfile,
  getStudentProfileByUserId,
} from "../controllers/studentProfileController.js";
import { getSkillGapReport } from "../controllers/skillGapController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, authorize("student"), upsertMyProfile);
router.get("/profile/my", protect, authorize("student"), getMyProfile);
router.get("/skill-gap", protect, authorize("student"), getSkillGapReport);
router.get("/profile/:userId", protect, getStudentProfileByUserId);

export default router;