import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import BankAccount from "@/models/BankAccount";
import Transaction from "@/models/Transaction";
import WithdrawalSetting from "@/models/WithdrawalSetting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bankAccountId, amount } = body;

    const numAmount = Number(amount);

    if (!userId || !bankAccountId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal parameters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          message: "Your account has been blocked. Please contact support.",
        },
        { status: 403 }
      );
    }

    // 1. Fetch live withdrawal limits set by Admin
    const setting = await WithdrawalSetting.findOne().lean();
    if (!setting) {
      return NextResponse.json(
        { success: false, message: "Withdrawal limits are not configured by Admin." },
        { status: 400 }
      );
    }

    if (numAmount < setting.minAmount) {
      return NextResponse.json(
        { success: false, message: `Minimum withdrawal amount is ₹${setting.minAmount}.` },
        { status: 400 }
      );
    }

    if (numAmount > setting.maxAmount) {
      return NextResponse.json(
        { success: false, message: `Maximum withdrawal amount is ₹${setting.maxAmount}.` },
        { status: 400 }
      );
    }

    // 2. Fetch user's bank account
    const bankAccount = await BankAccount.findOne({ _id: bankAccountId, userId });
    if (!bankAccount) {
      return NextResponse.json(
        { success: false, message: "Selected bank account not found." },
        { status: 404 }
      );
    }

    // 3. Fetch user's INR wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId });
    }

    if (wallet.inrBalance < numAmount) {
      return NextResponse.json(
        { success: false, message: `Insufficient INR balance. Available: ₹${wallet.inrBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Deduct INR from wallet for pending withdrawal
    wallet.inrBalance = wallet.inrBalance - numAmount;
    await wallet.save();

    // 4. Generate reference ID & create pending transaction
    const refId = `WD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bankDetailsStr = `${bankAccount.bankName} | A/C: ${bankAccount.accountNumber} | IFSC: ${bankAccount.ifscCode} | Name: ${bankAccount.accountHolderName}`;

    const transaction = await Transaction.create({
      userId,
      type: "withdrawal",
      asset: "INR",
      amount: numAmount,
      status: "pending",
      address: bankDetailsStr,
      referenceId: refId,
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal request of ₹${numAmount.toFixed(2)} submitted successfully! Reference ID: ${refId}`,
      wallet: {
        inrBalance: wallet.inrBalance,
      },
      transaction: {
        _id: transaction._id.toString(),
        referenceId: transaction.referenceId,
        amount: numAmount,
        status: transaction.status,
        address: bankDetailsStr,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Withdraw POST Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process withdrawal request." },
      { status: 500 }
    );
  }
}
