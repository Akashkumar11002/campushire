import Job from "../models/Job.js";

// @route  POST /api/jobs
// Post a new job with the logged-in recruiter as the poster
export const createJob = async (req, res) => {
  try {
    // Company comes from the recruiter's own linked company, not from the request body,
    // so a recruiter cannot post a job under someone else's company
    if (!req.user.company) {
      return res.status(400).json({
        message: "Please create a company profile before posting a job",
      });
    }

    const job = await Job.create({
      ...req.body,
      company: req.user.company,
      postedBy: req.user.id,
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/jobs
// Show all available jobs to students and recruiters
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .populate("company", "name logoUrl industry");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/jobs/:id
// To display the complete details of a specific job, such as on a job details page.)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("company", "name logoUrl industry website");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/jobs/:id
// The recruiter can edit only their own job, not someone else’s — that’s why we check `postedBy`.
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/jobs/:id
// Yahan bhi wahi wajah — sirf job ka owner hi delete kar sake
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};