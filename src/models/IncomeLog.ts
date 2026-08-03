import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIncomeLog extends Document {
  userId: string;
  fromUserId: string;
  amount: number;
  level: number;
  type: "level" | "ltd";
  asset: string;
  transactionAmount: number;
  referenceTxId: string;
  createdAt: Date;
}

const IncomeLogSchema = new Schema<IIncomeLog>(
  {
    userId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    level: { type: Number, required: true, default: 1 },
    type: { type: String, enum: ["level", "ltd"], default: "level" },
    asset: { type: String, default: "INR" },
    transactionAmount: { type: Number, default: 0 },
    referenceTxId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.IncomeLog) {
  delete mongoose.models.IncomeLog;
}

const IncomeLog: Model<IIncomeLog> =
  mongoose.models.IncomeLog || mongoose.model<IIncomeLog>("IncomeLog", IncomeLogSchema);

export default IncomeLog;
