import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionAsset = "INR" | "USDT" | "USDT-BEP20";

export interface ITransaction extends Document {
  userId: string;
  type: "deposit" | "withdrawal" | "sell" | "transfer";
  asset: TransactionAsset;
  amount: number;
  status: "pending" | "completed" | "rejected";
  address?: string;
  referenceId: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "sell", "transfer"],
      required: true,
    },
    asset: {
      type: String,
      enum: ["INR", "USDT", "USDT-BEP20"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    address: {
      type: String,
      default: "",
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

if (process.env.NODE_ENV === "development" && mongoose.models.Transaction) {
  delete mongoose.models.Transaction;
}

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
