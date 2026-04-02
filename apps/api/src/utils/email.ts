import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: env.SMTP_PASS
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    : undefined
});

export async function sendBookingEmail(email: string, content: { bookingCode: string; sportName: string; date: string; time: string }) {
  if (!email) {
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: `Booking confirmed for ${content.sportName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e293b;">
        <h2 style="margin-bottom: 8px;">Your Field Door booking is confirmed</h2>
        <p style="margin: 0 0 12px;">Booking code: <strong>${content.bookingCode}</strong></p>
        <p style="margin: 0 0 8px;">Sport: ${content.sportName}</p>
        <p style="margin: 0 0 8px;">Date: ${content.date}</p>
        <p style="margin: 0 0 8px;">Time: ${content.time}</p>
      </div>
    `
  });
}
