import Job from "../models/Job.js";
import StudentProfile from "../models/StudentProfile.js";
import JobMatch from "../models/JobMatch.js";
import calculateJobMatch from "../utils/calculateJobMatch.js";

// @route  GET /api/jobs/:jobId/match
// Calculates (or recalculates) how well the logged-in student matches a specific job
export const getJobMatch = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });

    const result = calculateJobMatch(studentProfile, job);

    // Recalculating overwrites the previous match for this student-job pair
    const match = await JobMatch.findOneAndUpdate(
      { job: job._id, student: req.user.id },
      {
        job: job._id,
        student: req.user.id,
        ...result,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/jobs/recommended
// Shows the student their best-matching open jobs, sorted highest match first —
// useful for a "recommended for you" section
export const getRecommendedJobs = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const jobs = await Job.find({ status: "open" }).populate("company", "name logoUrl");

    const jobsWithMatch = jobs.map((job) => {
      const result = calculateJobMatch(studentProfile, job);
      return { job, ...result };
    });

    // Highest match score first
    jobsWithMatch.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(jobsWithMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};