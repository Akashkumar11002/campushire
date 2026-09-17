// Compares a student's profile against a job's requirements and returns a match score.
// This is a rule-based approach (skill overlap + basic profile completeness),
// not true semantic/embedding-based matching, but it gives an explainable, useful result.
const calculateJobMatch = (studentProfile, job) => {
  const studentSkills = (studentProfile?.skills || []).map((s) => s.toLowerCase());
  const requiredSkills = (job.skillsRequired || []).map((s) => s.toLowerCase());

  const matchedSkills = requiredSkills.filter((skill) => studentSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !studentSkills.includes(skill));

  // Skill overlap makes up 70% of the score — it's the strongest signal for job fit
  const skillScore =
    requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 70
      : 70; // if the job lists no required skills, don't penalize the student for this part

  // Education and project presence contribute the remaining 30%,
  // since a well-rounded profile matters even beyond exact skill overlap
  let profileScore = 0;
  if (studentProfile?.education?.length > 0) profileScore += 15;
  if (studentProfile?.projects?.length > 0) profileScore += 15;

  const matchScore = Math.round(skillScore + profileScore);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
};

export default calculateJobMatch;