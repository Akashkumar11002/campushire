import Assessment from "../models/Assessment.js";
import Submission from "../models/Submission.js";
import Job from "../models/Job.js";

// @route  POST /api/assessments
export const createAssessment = async (req, res) => {
  try {
    const { jobId, title, durationMinutes, questions } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to create an assessment for this job" });
    }

    const assessment = await Assessment.create({
      job: jobId,
      createdBy: req.user.id,
      title,
      durationMinutes,
      questions,
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/assessments/:id/start
// Records the start time and hands the student the questions WITHOUT correct answers
export const startAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const existing = await Submission.findOne({ assessment: assessment._id, student: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You have already started or completed this assessment" });
    }

    await Submission.create({
      assessment: assessment._id,
      student: req.user.id,
      startedAt: new Date(),
      totalQuestions: assessment.questions.length,
    });

    // Strip correct answers before sending questions to the student
    const questionsForStudent = assessment.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.status(200).json({
      title: assessment.title,
      durationMinutes: assessment.durationMinutes,
      questions: questionsForStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/assessments/:id/submit
export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // [{ question: "<questionId>", selectedOptionIndex: 2 }, ...]

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const submission = await Submission.findOne({ assessment: assessment._id, student: req.user.id });
    if (!submission) {
      return res.status(400).json({ message: "You need to start the assessment before submitting" });
    }
    if (submission.submittedAt) {
      return res.status(400).json({ message: "You have already submitted this assessment" });
    }

    // Enforce the time limit — reject a submission that arrives after time is up
    const deadline = new Date(submission.startedAt.getTime() + assessment.durationMinutes * 60000);
    if (new Date() > deadline) {
      return res.status(400).json({ message: "Time limit exceeded. Submission not accepted." });
    }

    // Score by comparing each answer to the correct option stored in the assessment
    let score = 0;
    answers.forEach((answer) => {
      const question = assessment.questions.id(answer.question);
      if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
        score += 1;
      }
    });

    submission.answers = answers;
    submission.score = score;
    submission.submittedAt = new Date();
    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/assessments/:id/results
// Recruiter views all submissions for an assessment they created
export const getAssessmentResults = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    if (assessment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view these results" });
    }

    const submissions = await Submission.find({ assessment: assessment._id }).populate(
      "student",
      "name email"
    );

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};