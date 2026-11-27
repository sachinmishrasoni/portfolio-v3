
import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_APP_PASSWORD;

if (!smtpUser || !smtpPassword) {
    throw new Error("Missing Gmail SMTP environment variables");
}

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    },
});
