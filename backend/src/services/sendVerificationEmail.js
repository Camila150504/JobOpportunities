import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const url = `http://localhost:5000/api/users/verify-email/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Please verify your email",
    html: `
      <h3>Hello ${user.first_name},</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${url}">Verify Email</a>
    `,
  });
};
