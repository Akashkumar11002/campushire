import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected"],
      default: "applied",
    },
    resumeUrl: {
      type: String,
    },
    coverNote: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ek student ek hi job pe ek baar apply kar sake, dobara nahi — isliye ye unique combo banaya
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;