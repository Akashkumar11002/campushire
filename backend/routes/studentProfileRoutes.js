import express from "express";
import {
  upsertMyProfile,
  getMyProfile,
  getStudentProfileByUserId,
} from "../controllers/studentProfileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, authorize("student"), upsertMyProfile);
router.get("/profile/my", protect, authorize("student"), getMyProfile);

router.get("/profile/:userId", protect, getStudentProfileByUserId);

export default router;