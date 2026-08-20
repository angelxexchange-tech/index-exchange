import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import BankAccount from "@/models/BankAccount";
import Transaction from "@/models/Transaction";
import IncomeLog from "@/models/IncomeLog";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Invalid parameters. Required: userId." },
        { status: 400 }
      );
    }

    const cleanUserId = userId.trim();

    await connectToDatabase();

    const user = await User.findOne({ userId: cleanUserId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: `User ID ${cleanUserId} not found.` },
        { status: 404 }
      );
    }

    // Remove the user and everything owned by them.
    // IncomeLog entries where this user is `fromUserId` are kept, since that
    // income was already credited to other users' wallets.
    const [wallets, bankAccounts, transactions, incomeLogs] = await Promise.all([
      Wallet.deleteMany({ userId: cleanUserId }),
      BankAccount.deleteMany({ userId: cleanUserId }),
      Transaction.deleteMany({ userId: cleanUserId }),
      IncomeLog.deleteMany({ userId: cleanUserId }),
    ]);

    await User.deleteOne({ userId: cleanUserId });

    return NextResponse.json({
      success: true,
      message: `User ${cleanUserId} and all related records have been permanently deleted.`,
      deleted: {
        user: 1,
        wallets: wallets.deletedCount || 0,
        bankAccounts: bankAccounts.deletedCount || 0,
        transactions: transactions.deletedCount || 0,
        incomeLogs: incomeLogs.deletedCount || 0,
      },
    });
  } catch (error: any) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}
