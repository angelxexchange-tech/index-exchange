import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminOtp extends Document {
  adminId: string;
  purpose: string;
  codeHash: string;
  fingerprint: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
}

const AdminOtpSchema = new Schema<IAdminOtp>(
  {
    adminId: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AdminOtpSchema.index({ adminId: 1, purpose: 1 }, { unique: true });
// MongoDB removes expired codes automatically
AdminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

if (process.env.NODE_ENV === "development" && mongoose.models.AdminOtp) {
  delete mongoose.models.AdminOtp;
}

const AdminOtp: Model<IAdminOtp> =
  mongoose.models.AdminOtp || mongoose.model<IAdminOtp>("AdminOtp", AdminOtpSchema);

export default AdminOtp;
