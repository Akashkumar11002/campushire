import StudentProfile from "../models/StudentProfile.js";
import calculateProfileCompletion from "../utils/calculateProfileCompletion.js";

// @route  PUT /api/students/profile
export const upsertMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });

    if (profile) {
      Object.assign(profile, req.body);
    } else {
      profile = new StudentProfile({ ...req.body, user: req.user.id });
    }

    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/students/profile/my
export const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id }).populate(
      "user",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found. Please create one." });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/students/profile/:userId
export const getStudentProfileByUserId = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.params.userId }).populate(
      "user",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};