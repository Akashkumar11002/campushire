// Simple, reusable HTML email templates.
// Kept minimal and inline-styled since many email clients strip external CSS.

export const applicationConfirmationTemplate = (studentName, jobTitle, companyName) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #2563eb;">Application Received!</h2>
    <p>Hi ${studentName},</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.</p>
    <p>We'll notify you as soon as there's an update on your application status.</p>
    <p style="color: #6b7280; font-size: 12px;">— The CampusHire Team</p>
  </div>
`;

export const applicationStatusTemplate = (studentName, jobTitle, status) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #2563eb;">Application Status Update</h2>
    <p>Hi ${studentName},</p>
    <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status.toUpperCase()}</strong></p>
    <p>Log in to CampusHire to view more details.</p>
    <p style="color: #6b7280; font-size: 12px;">— The CampusHire Team</p>
  </div>
`;


export const interviewScheduledTemplate = (studentName, jobTitle, roundType, scheduledAt, mode, meetingLinkOrLocation) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #2563eb;">Interview Scheduled</h2>
    <p>Hi ${studentName},</p>
    <p>Your <strong>${roundType}</strong> interview for <strong>${jobTitle}</strong> has been scheduled.</p>
    <p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
    <p><strong>Mode:</strong> ${mode}</p>
    <p><strong>${mode === "online" ? "Meeting Link" : "Location"}:</strong> ${meetingLinkOrLocation || "To be shared"}</p>
    <p>Log in to CampusHire for more details.</p>
    <p style="color: #6b7280; font-size: 12px;">— The CampusHire Team</p>
  </div>
`;