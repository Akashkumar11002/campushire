import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // size in bytes
    },
    version: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // the current/latest resume being used
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;