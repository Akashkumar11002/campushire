import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema(
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
    matchScore: {
      type: Number, // 0-100
      required: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// One match record per student-job pair — recalculating overwrites the old one
jobMatchSchema.index({ job: 1, student: 1 }, { unique: true });

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;