import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roundType: {
      type: String, // e.g. "Technical", "HR", "Managerial"
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    meetingLink: {
      type: String,
    },
    location: {
      type: String, // used when mode is "offline"
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;