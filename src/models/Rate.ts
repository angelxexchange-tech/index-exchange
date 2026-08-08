import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRate extends Document {
  asset: string; // e.g. "USDT-TRC20", "USDT-BEP20"
  rate: number;  // Rate in INR per unit, set dynamically by Admin
  updatedAt: Date;
}

const RateSchema = new Schema<IRate>(
  {
    asset: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.Rate) {
  delete mongoose.models.Rate;
}

const Rate: Model<IRate> =
  mongoose.models.Rate || mongoose.model<IRate>("Rate", RateSchema);

export default Rate;
