import express from "express";
import {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyById,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiters can create or manage a company
router.post("/", protect, authorize("recruiter"), createCompany);
router.get("/my", protect, authorize("recruiter"), getMyCompany);
router.put("/:id", protect, authorize("recruiter"), updateCompany);

// Anyone can view a company's public details
router.get("/:id", getCompanyById);

export default router;