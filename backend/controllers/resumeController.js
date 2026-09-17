import Resume from "../models/Resume.js";

// @route  POST /api/resumes/upload
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // Mark all previous resumes as inactive — only the newest one should be "active"
    await Resume.updateMany({ student: req.user.id }, { isActive: false });

    const previousCount = await Resume.countDocuments({ student: req.user.id });

    const resume = await Resume.create({
      student: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      version: previousCount + 1,
      isActive: true,
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/resumes/my
// Returns all resume versions for the logged-in student, newest first
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ student: req.user.id }).sort({ version: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/resumes/:id
// Only the owning student can delete their own resume version
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (resume.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this resume" });
    }

    await resume.deleteOne();
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};