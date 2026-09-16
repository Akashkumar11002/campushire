import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @route  POST /api/applications/:jobId
// Student job pe apply karta hai — pehle check kiya job exist karti hai ya nahi,
// aur duplicate apply hone par sahi error message diya (kyunki DB unique index bas silent fail karega)
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      student: req.user.id,
      resumeUrl: req.body.resumeUrl,
      coverNote: req.body.coverNote,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/applications/my
// Student apni saari applications dekh sake — track karne ke liye kahan-kahan apply kiya
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate(
      "job",
      "title company location status"
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/applications/job/:jobId
// Recruiter dekh sake kisne uski job pe apply kiya — lekin sirf apni hi job ki, isliye ownership check kiya
export const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: req.params.jobId }).populate(
      "student",
      "name email"
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/applications/:id/status
// Recruiter kisi candidate ko shortlist/reject/select kar sake — yahan bhi sirf job ka owner hi kar sake, isliye job fetch karke check kiya
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};