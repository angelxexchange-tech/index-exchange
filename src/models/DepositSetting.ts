import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepositSetting extends Document {
  asset: string;
  network: string;
  depositAddress: string;
  qrImageData: string;
  explorerUrl: string;
  updatedAt: Date;
}

const DepositSettingSchema = new Schema<IDepositSetting>(
  {
    asset: {
      type: String,
      default: "USDT-TRC20",
    },
    network: {
      type: String,
      default: "TRON Network (TRC20)",
    },
    depositAddress: {
      type: String,
      required: true,
      trim: true,
    },
    qrImageData: {
      type: String,
      required: true,
    },
    explorerUrl: {
      type: String,
      default: "https://tronscan.org",
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.DepositSetting) {
  delete mongoose.models.DepositSetting;
}

const DepositSetting: Model<IDepositSetting> =
  mongoose.models.DepositSetting ||
  mongoose.model<IDepositSetting>("DepositSetting", DepositSettingSchema);

export default DepositSetting;
