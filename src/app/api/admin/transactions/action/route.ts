import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";
import Rate from "@/models/Rate";
import { processReferralCommissions } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, action } = body; // action: "approve" | "reject"

    if (!transactionId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters. Required: transactionId, action (approve/reject)" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 }
      );
    }

    if (transaction.status !== "pending") {
      return NextResponse.json(
        { success: false, message: `Transaction is already ${transaction.status}.` },
        { status: 400 }
      );
    }

    let wallet = await Wallet.findOne({ userId: transaction.userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId: transaction.userId });
    }

    const fieldMap: Record<string, keyof typeof wallet> = {
      INR: "inrBalance",
      USDT: "usdtBalance",
      "USDT-BEP20": "usdtBep20Balance",
    };

    const targetField = fieldMap[transaction.asset.toUpperCase()];

    if (action === "approve") {
      transaction.status = "completed";

      // If approving a deposit, credit user wallet
      if (transaction.type === "deposit" && targetField) {
        (wallet as any)[targetField] = ((wallet as any)[targetField] || 0) + transaction.amount;
        await wallet.save();

        // Process referral commissions for approved deposit
        let depositAmountInINR = transaction.amount;
        if (transaction.asset !== "INR") {
          const rateDoc = await Rate.findOne({ asset: transaction.asset.toUpperCase() });
          if (rateDoc && rateDoc.rate > 0) {
            depositAmountInINR = transaction.amount * rateDoc.rate;
          }
        }

        await processReferralCommissions({
          userId: transaction.userId,
          transactionType: "deposit",
          amountInINR: depositAmountInINR,
          asset: transaction.asset,
          referenceId: transaction.referenceId,
        });
      }
    } else if (action === "reject") {
      transaction.status = "rejected";

      // If rejecting a withdrawal, refund user wallet
      if (transaction.type === "withdrawal" && targetField) {
        (wallet as any)[targetField] = ((wallet as any)[targetField] || 0) + transaction.amount;
        await wallet.save();
      }
    }

    await transaction.save();

    return NextResponse.json({
      success: true,
      message: `Transaction ${transaction.referenceId} ${action === "approve" ? "Approved" : "Rejected"} successfully.`,
      transaction: {
        _id: transaction._id.toString(),
        referenceId: transaction.referenceId,
        status: transaction.status,
      },
    });
  } catch (error: any) {
    console.error("Transaction action error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update transaction status." },
      { status: 500 }
    );
  }
}
