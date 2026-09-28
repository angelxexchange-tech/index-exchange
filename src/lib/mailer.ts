import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP email is not configured on the server.");
  }

  if (!transporter) {
    const port = Number(SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  return transporter;
}

interface MailAttachment {
  filename: string;
  // A data: URI (file and URL access are disabled below)
  path: string;
}

export async function sendMail({
  to,
  subject,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  attachments?: MailAttachment[];
}): Promise<void> {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments,
    // Attachments may only be inline data, never server files or remote URLs
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
