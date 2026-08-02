import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWithdrawalSetting extends Document {
  minAmount: number;
  maxAmount: number;
  feePercentage: number;
  updatedAt: Date;
}

const WithdrawalSettingSchema = new Schema<IWithdrawalSetting>(
  {
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    feePercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.WithdrawalSetting) {
  delete mongoose.models.WithdrawalSetting;
}

const WithdrawalSetting: Model<IWithdrawalSetting> =
  mongoose.models.WithdrawalSetting ||
  mongoose.model<IWithdrawalSetting>("WithdrawalSetting", WithdrawalSettingSchema);

export default WithdrawalSetting;
