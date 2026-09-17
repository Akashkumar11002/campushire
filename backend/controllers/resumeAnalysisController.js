import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/Resume.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import analyzeResume from "../utils/analyzeResume.js";

// @route  POST /api/resumes/:id/analyze
export const analyzeResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (resume.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to analyze this resume" });
    }

    // Read the actual PDF file from disk and extract its text
    const fileBuffer = fs.readFileSync(resume.filePath);
    const pdfData = await pdfParse(fileBuffer);

    const result = analyzeResume(pdfData.text);

    // Re-analyzing the same resume overwrites the previous analysis (upsert),
    // since the model has a unique index on "resume"
    const analysis = await ResumeAnalysis.findOneAndUpdate(
      { resume: resume._id },
      {
        resume: resume._id,
        student: req.user.id,
        ...result,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/resumes/:id/analysis
// Fetch a previously saved analysis, without re-analyzing the PDF again
export const getResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ resume: req.params.id });

    if (!analysis) {
      return res.status(404).json({ message: "No analysis found. Please analyze this resume first." });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};