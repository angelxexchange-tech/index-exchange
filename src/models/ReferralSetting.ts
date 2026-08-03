import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferralLevel {
  level: number;
  percentage: number;
}

export interface IReferralSetting extends Document {
  levels: IReferralLevel[];
  isDepositCommissionEnabled: boolean;
  isSellCommissionEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSettingSchema = new Schema<IReferralSetting>(
  {
    levels: [
      {
        level: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
    ],
    isDepositCommissionEnabled: { type: Boolean, default: true },
    isSellCommissionEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.ReferralSetting) {
  delete mongoose.models.ReferralSetting;
}

const ReferralSetting: Model<IReferralSetting> =
  mongoose.models.ReferralSetting ||
  mongoose.model<IReferralSetting>("ReferralSetting", ReferralSettingSchema);

export default ReferralSetting;
