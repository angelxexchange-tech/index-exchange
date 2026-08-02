import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankAccount extends Document {
  userId: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: Date;
}

const BankAccountSchema = new Schema<IBankAccount>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.BankAccount) {
  delete mongoose.models.BankAccount;
}

const BankAccount: Model<IBankAccount> =
  mongoose.models.BankAccount ||
  mongoose.model<IBankAccount>("BankAccount", BankAccountSchema);

export default BankAccount;
