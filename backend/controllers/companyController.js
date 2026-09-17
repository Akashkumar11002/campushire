import Company from "../models/Company.js";
import User from "../models/User.js";

// @route  POST /api/companies
// The recruiter creates a new company profile, which is immediately linked to the User model as well.
// So that we don't have to query the database repeatedly to find the recruiter’s company later.
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      createdBy: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/companies/my
// A recruiter can view their own company.
export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user.id });

    if (!company) {
      return res.status(404).json({ message: "Company not found. Please create one." });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/companies/:id
// A recruiter can edit only their own company — ownership is verified.
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this company" });
    }

    Object.assign(company, req.body);
    await company.save();

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/companies/:id
//A student or anyone else can view the company’s public details and connect with it for job opportunities.
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};