import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupportedBank extends Document {
  bankName: string;
  isEnabled: boolean;
  createdAt: Date;
}

const SupportedBankSchema = new Schema<ISupportedBank>(
  {
    bankName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.SupportedBank) {
  delete mongoose.models.SupportedBank;
}

const SupportedBank: Model<ISupportedBank> =
  mongoose.models.SupportedBank ||
  mongoose.model<ISupportedBank>("SupportedBank", SupportedBankSchema);

export default SupportedBank;
