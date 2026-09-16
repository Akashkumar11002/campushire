import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
    grade: { type: String },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String,required: true },
    description: {type: String},
    techStack: { type: [String],default: [] },
    link: { type:String },
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
      unique: true, 
    },
    education: {
      type: [educationSchema],
      default:[],
    },
    skills:{
      type: [String],
      default:[],
    },
    projects:{
      type: [projectSchema],
      default:[],
    },
    certifications: {
      type:[String],
      default: [],
    },
    githubUrl:{type: String },
    linkedinUrl: {type: String },
    portfolioUrl: {type:String },
    bio: { type: String },
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;