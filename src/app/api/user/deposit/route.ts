import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Transaction, { TransactionAsset } from "@/models/Transaction";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, transactionId, asset } = body;

    const numAmount = Number(amount);
    const cleanTxId = transactionId ? String(transactionId).trim() : "";
    const targetAsset = (asset ? String(asset).trim().toUpperCase() : "USDT") as TransactionAsset;
    const allowedAssets: TransactionAsset[] = ["INR", "USDT", "USDT-BEP20"];

    if (!allowedAssets.includes(targetAsset)) {
      return NextResponse.json(
        { success: false, message: `Invalid asset '${targetAsset}'. Supported assets: ${allowedAssets.join(", ")}.` },
        { status: 400 }
      );
    }

    if (!userId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid deposit amount." },
        { status: 400 }
      );
    }

    if (!cleanTxId) {
      return NextResponse.json(
        { success: false, message: "Please enter the Transaction ID / Hash (TXID)." },
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

    // Check if duplicate transaction ID was submitted
    const existingTx = await Transaction.findOne({ address: cleanTxId, type: "deposit" });
    if (existingTx) {
      return NextResponse.json(
        { success: false, message: "This Transaction ID / Hash has already been submitted." },
        { status: 400 }
      );
    }

    const refId = `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await Transaction.create({
      userId,
      type: "deposit",
      asset: targetAsset,
      amount: numAmount,
      status: "pending",
      address: cleanTxId,
      referenceId: refId,
    });

    return NextResponse.json({
      success: true,
      message: `Deposit request of ${numAmount} ${targetAsset} submitted successfully for Admin review! Reference ID: ${refId}`,
      transaction: {
        _id: transaction._id.toString(),
        referenceId: transaction.referenceId,
        amount: numAmount,
        asset: targetAsset,
        status: transaction.status,
        address: cleanTxId,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error: any) {
    console.error("User Deposit POST Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to submit deposit request." },
      { status: 500 }
    );
  }
}
