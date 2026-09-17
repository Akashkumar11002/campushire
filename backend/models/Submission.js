import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // references the _id of a question inside the Assessment
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    score: {
      type: Number,
    },
    totalQuestions: {
      type: Number,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// One submission per student per assessment — prevents retaking after submitting
submissionSchema.index({ assessment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;