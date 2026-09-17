// A master list of common tech skills to check for in a resume.
// This can be expanded over time, or later replaced with skills pulled from active job postings.
const SKILLS_LIST = [
  "javascript", "typescript", "python", "java", "c++", "c#",
  "react", "angular", "vue", "node.js", "express", "next.js",
  "mongodb", "mysql", "postgresql", "sql", "redis",
  "html", "css", "tailwind", "bootstrap",
  "git", "github", "docker", "kubernetes", "aws", "azure", "gcp",
  "rest api", "graphql", "machine learning", "data structures", "algorithms",
];

// Basic checks that indicate a resume is well-structured
const SECTION_KEYWORDS = {
  education: ["education", "b.tech", "degree", "university", "college"],
  experience: ["experience", "internship", "worked at"],
  projects: ["project", "projects"],
  contact: ["email", "phone", "linkedin", "github"],
};

const analyzeResume = (resumeText) => {
  const text = resumeText.toLowerCase();

  // Find which skills from our master list appear in the resume text
  const matchedSkills = SKILLS_LIST.filter((skill) => text.includes(skill));
  const missingSkills = SKILLS_LIST.filter((skill) => !matchedSkills.includes(skill)).slice(0, 5);

  const strengths = [];
  const suggestions = [];

  // Check structural sections
  if (SECTION_KEYWORDS.education.some((k) => text.includes(k))) {
    strengths.push("Education section is present");
  } else {
    suggestions.push("Add an Education section with your degree and institution");
  }

  if (SECTION_KEYWORDS.experience.some((k) => text.includes(k))) {
    strengths.push("Experience/internship details are present");
  } else {
    suggestions.push("Add any internship or work experience, even if short-term");
  }

  if (SECTION_KEYWORDS.projects.some((k) => text.includes(k))) {
    strengths.push("Projects section is present");
  } else {
    suggestions.push("Add a few projects with tech stack and outcomes");
  }

  if (SECTION_KEYWORDS.contact.some((k) => text.includes(k))) {
    strengths.push("Contact/social links are present");
  } else {
    suggestions.push("Add contact details like email, LinkedIn or GitHub");
  }

  if (matchedSkills.length >= 5) {
    strengths.push(`Strong technical skill coverage (${matchedSkills.length} skills found)`);
  } else {
    suggestions.push("List more relevant technical skills clearly, ideally in a dedicated section");
  }

  // Score: half comes from structure (4 sections), half from skill coverage
  const sectionScore =
    (Object.keys(SECTION_KEYWORDS).filter((key) =>
      SECTION_KEYWORDS[key].some((k) => text.includes(k))
    ).length /
      Object.keys(SECTION_KEYWORDS).length) *
    50;

  const skillScore = Math.min((matchedSkills.length / 10) * 50, 50);

  const score = Math.round(sectionScore + skillScore);

  return {
    score,
    matchedSkills,
    missingSkills,
    strengths,
    suggestions,
  };
};

export default analyzeResume;