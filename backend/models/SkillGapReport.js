import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    // how many open jobs require this skill that the student doesn't have
    jobsRequiringIt: { type: Number, required: true },
  },
  { _id: false }
);

const skillGapReportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one up-to-date report per student — regenerating overwrites it
    },
    gaps: {
      type: [skillGapSchema],
      default: [],
    },
    jobsAnalyzed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SkillGapReport = mongoose.model("SkillGapReport", skillGapReportSchema);

export default SkillGapReport;