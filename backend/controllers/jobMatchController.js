import Job from "../models/Job.js";
import StudentProfile from "../models/StudentProfile.js";
import JobMatch from "../models/JobMatch.js";
import calculateJobMatch from "../utils/calculateJobMatch.js";
import Application from "../models/Application.js";

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

    // Jobs the student has already applied to shouldn't be recommended again
    const appliedApplications = await Application.find({ student: req.user.id }).select("job");
    const appliedJobIds = appliedApplications.map((app) => app.job.toString());

    // Exclude closed jobs and jobs whose deadline has already passed
    const jobs = await Job.find({
      status: "open",
      _id: { $nin: appliedJobIds },
      $or: [{ applicationDeadline: { $exists: false } }, { applicationDeadline: { $gte: new Date() } }],
    }).populate("company", "name logoUrl");

    const jobsWithMatch = jobs.map((job) => {
      const result = calculateJobMatch(studentProfile, job);

      // A short, human-readable explanation for why this job was recommended
      let reason;
      if (result.matchedSkills.length > 0) {
        reason = `Matches ${result.matchedSkills.length} of ${job.skillsRequired.length} required skills, including ${result.matchedSkills.slice(0, 2).join(", ")}`;
      } else {
        reason = "Based on your overall profile strength";
      }

      return { job, ...result, reason };
    });

    // Highest match score first
    jobsWithMatch.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(jobsWithMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};