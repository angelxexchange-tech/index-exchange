import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  mobileNumber: string;
  email?: string;
  password?: string;
  referralId?: string;
  otpCode?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  blockedAt?: Date | null;
  blockReason?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    referralId: {
      type: String,
      default: "",
      trim: true,
    },
    otpCode: {
      type: String,
      default: "",
    },
    otpExpiry: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    blockReason: {
      type: String,
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Clear model cache in development to reflect schema updates immediately
if (process.env.NODE_ENV === "development" && mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
