import transporter from "../config/emailConfig.js";

// Generic reusable function to send an email — used across the app
// for application confirmations, status updates, interview invites, etc.
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"CampusHire" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    // Email failures shouldn't crash the main request (e.g. applying to a job) —
    // just log it so the core action still succeeds even if the email fails
    console.log("Email sending failed:", error.message);
  }
};

export default sendEmail;