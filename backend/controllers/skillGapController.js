import Job from "../models/Job.js";
import StudentProfile from "../models/StudentProfile.js";
import SkillGapReport from "../models/SkillGapReport.js";

// @route  GET /api/students/skill-gap
export const getSkillGapReport = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const studentSkills = (studentProfile?.skills || []).map((s) => s.toLowerCase());

    const jobs = await Job.find({ status: "open" });

    // Count how many jobs require each skill the student doesn't already have
    const gapCounts = {};

    jobs.forEach((job) => {
      const requiredSkills = (job.skillsRequired || []).map((s) => s.toLowerCase());
      requiredSkills.forEach((skill) => {
        if (!studentSkills.includes(skill)) {
          gapCounts[skill] = (gapCounts[skill] || 0) + 1;
        }
      });
    });

    // Convert to an array and sort so the most in-demand missing skill comes first
    const gaps = Object.entries(gapCounts)
      .map(([skill, jobsRequiringIt]) => ({ skill, jobsRequiringIt }))
      .sort((a, b) => b.jobsRequiringIt - a.jobsRequiringIt);

    const report = await SkillGapReport.findOneAndUpdate(
      { student: req.user.id },
      {
        student: req.user.id,
        gaps,
        jobsAnalyzed: jobs.length,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};