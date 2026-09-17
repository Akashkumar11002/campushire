import nodemailer from "nodemailer";

// Sets up a reusable transporter that sends emails through Gmail,
// using an App Password instead of the real account password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export default transporter;