// Profile ke important fields check karke completion % nikalta hai
const calculateProfileCompletion = (profile) => {
  const fields = [
    profile.education?.length > 0,
    profile.skills?.length > 0,
    profile.projects?.length > 0,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.bio,
  ];

  const filledCount = fields.filter(Boolean).length;
  const percentage = Math.round((filledCount / fields.length) * 100);

  return percentage;
};

export default calculateProfileCompletion;