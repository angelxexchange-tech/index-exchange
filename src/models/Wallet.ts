import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  inrBalance: number;
  usdtTrc20Balance: number;
  usdtBep20Balance: number;
  levelIncome: number;
  ltdIncome: number;
  totalIncome: number;
  createdAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    inrBalance: {
      type: Number,
      default: 0,
    },
    usdtTrc20Balance: {
      type: Number,
      default: 0,
    },
    usdtBep20Balance: {
      type: Number,
      default: 0,
    },
    levelIncome: {
      type: Number,
      default: 0,
    },
    ltdIncome: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
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

if (process.env.NODE_ENV === "development" && mongoose.models.Wallet) {
  delete mongoose.models.Wallet;
}

const Wallet: Model<IWallet> =
  mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);

export default Wallet;
