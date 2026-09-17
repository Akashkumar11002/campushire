import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import sendNotification from "../utils/sendNotification.js";
import sendEmail from "../utils/sendEmail.js";
import { interviewScheduledTemplate } from "../utils/emailTemplates.js";

// @route  POST /api/interviews
// Recruiter schedules an interview for a specific application
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, roundType, scheduledAt, mode, meetingLink, location } = req.body;

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to schedule this interview" });
    }

    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      student: application.student,
      recruiter: req.user.id,
      roundType,
      scheduledAt,
      mode,
      meetingLink,
      location,
    });

    // Notify the student both in-app and via email
    await sendNotification({
      recipient: application.student,
      message: `Your ${roundType} interview for "${application.job.title}" has been scheduled`,
      type: "general",
      relatedId: interview._id,
    });

    const student = await User.findById(application.student);
    if (student) {
      sendEmail({
        to: student.email,
        subject: `Interview Scheduled - ${application.job.title}`,
        html: interviewScheduledTemplate(
          student.name,
          application.job.title,
          roundType,
          scheduledAt,
          mode,
          mode === "online" ? meetingLink : location
        ),
      });
    }

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/interviews/my
// Works for both students and recruiters — returns interviews relevant to whoever is logged in
export const getMyInterviews = async (req, res) => {
  try {
    const filter =
      req.user.role === "recruiter" ? { recruiter: req.user.id } : { student: req.user.id };

    const interviews = await Interview.find(filter)
      .populate("job", "title")
      .populate("student", "name email")
      .sort({ scheduledAt: 1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};