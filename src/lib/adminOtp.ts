
import crypto from "crypto";
import AdminOtp from "@/models/AdminOtp";
import { sendMail } from "@/lib/mailer";

// Email one-time codes that approve a specific sensitive admin change.
// Codes always go to ADMIN_OTP_EMAIL, which cannot be changed from the admin panel.

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export type AdminOtpPurpose = "deposit-settings";

export class AdminOtpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

export function getAdminOtpEmail(): string {
  const email = process.env.ADMIN_OTP_EMAIL?.trim();
  if (!email) {
    throw new AdminOtpError("Admin OTP email is not configured on the server.", 500);
  }
  return email;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

// Generates a code bound to `fingerprint` and emails it. Returns the masked recipient.
export async function issueAdminOtp({
  adminId,
  purpose,
  fingerprint,
  summary,
  attachments,
}: {
  adminId: string;
  purpose: AdminOtpPurpose;
  fingerprint: string;
  summary: string;
  attachments?: { filename: string; path: string }[];
}): Promise<string> {
  const to = getAdminOtpEmail();

  const existing = await AdminOtp.findOne({ adminId, purpose });
  if (existing) {
    const waitMs = existing.lastSentAt.getTime() + RESEND_COOLDOWN_MS - Date.now();
    if (waitMs > 0) {
      throw new AdminOtpError(`Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code.`, 429);
    }
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const now = Date.now();

  const record = await AdminOtp.findOneAndUpdate(
    { adminId, purpose },
    {
      codeHash: sha256(code),
      fingerprint: sha256(fingerprint),
      expiresAt: new Date(now + OTP_TTL_MS),
      attempts: 0,
      lastSentAt: new Date(now),
    },
    { upsert: true, new: true }
  );

  try {
    await sendMail({
      to,
      subject: `Index Exchange admin verification code: ${code}`,
      text: [
        `Your admin verification code is: ${code}`,
        `It expires in 10 minutes and works only for the change below.`,
        ``,
        `Requested by admin: ${adminId}`,
        summary,
        ``,
        `If you did not request this, do not use the code and change the admin password immediately.`,
      ].join("\n"),
      attachments,
    });
  } catch (err) {
    // Let the admin retry right away instead of waiting out the cooldown
    await AdminOtp.deleteOne({ _id: record._id });
    console.error("Admin OTP email error:", err);
    throw new AdminOtpError("Failed to send the verification email. Please try again.", 500);
  }

  return maskEmail(to);
}

// Verifies and consumes a code. Throws AdminOtpError when it is not valid for `fingerprint`.
export async function consumeAdminOtp({
  adminId,
  purpose,
  fingerprint,
  code,
}: {
  adminId: string;
  purpose: AdminOtpPurpose;
  fingerprint: string;
  code: unknown;
}): Promise<void> {
  if (typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
    throw new AdminOtpError("Enter the 6-digit verification code sent to your email.");
  }

  // Count the attempt before checking, so parallel guesses cannot exceed MAX_ATTEMPTS
  const record = await AdminOtp.findOneAndUpdate(
    { adminId, purpose, expiresAt: { $gt: new Date() }, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { new: true }
  );

  if (!record) {
    await AdminOtp.deleteOne({ adminId, purpose, attempts: { $gte: MAX_ATTEMPTS } });
    throw new AdminOtpError("Verification code expired or too many attempts. Please request a new code.");
  }

  const codeMatches = crypto.timingSafeEqual(
    Buffer.from(record.codeHash, "hex"),
    Buffer.from(sha256(code.trim()), "hex")
  );

  if (!codeMatches) {
    const remaining = MAX_ATTEMPTS - record.attempts;
    throw new AdminOtpError(
      remaining > 0
        ? `Invalid verification code. ${remaining} attempt(s) left.`
        : "Invalid verification code. Please request a new code."
    );
  }

  if (record.fingerprint !== sha256(fingerprint)) {
    throw new AdminOtpError("The details changed after the code was sent. Please request a new code.");
  }

  // Single use: only one request can delete the record
  const consumed = await AdminOtp.findOneAndDelete({ _id: record._id, codeHash: record.codeHash });
  if (!consumed) {
    throw new AdminOtpError("This verification code was already used. Please request a new code.");
  }
}
