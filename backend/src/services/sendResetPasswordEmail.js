import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const resetLink = `http://localhost:5000/api/users/reset-password/${token}`;

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
    subject: "Reset your password",
    html: `
      <h3>Hello ${user.first_name},</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  });
};
