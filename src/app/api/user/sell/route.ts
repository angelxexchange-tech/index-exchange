import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import Transaction from "@/models/Transaction";
import Rate from "@/models/Rate";
import { processReferralCommissions } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, asset, amount } = body;

    if (!userId || !asset || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid sell parameters." },
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

    // Fetch exchange rate strictly from Database set by Admin
    const rateDoc = await Rate.findOne({ asset: asset.toUpperCase() });
    if (!rateDoc || typeof rateDoc.rate !== "number" || rateDoc.rate <= 0) {
      return NextResponse.json(
        { success: false, message: `Exchange rate for ${asset} is not configured by Admin.` },
        { status: 400 }
      );
    }

    const currentRate = rateDoc.rate;

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId });
    }

    // Determine target balance field
    const fieldMap: Record<string, keyof typeof wallet> = {
      "USDT-TRC20": "usdtTrc20Balance",
      "USDT-BEP20": "usdtBep20Balance",
    };

    const targetField = fieldMap[asset.toUpperCase()];
    if (!targetField) {
      return NextResponse.json(
        { success: false, message: `Unsupported asset: ${asset}` },
        { status: 400 }
      );
    }

    const currentAssetBalance = (wallet[targetField] as number) || 0;
    if (currentAssetBalance < amount) {
      return NextResponse.json(
        { success: false, message: `Insufficient ${asset} balance. Available: ${currentAssetBalance}` },
        { status: 400 }
      );
    }

    const expectedINR = amount * currentRate;

    // Deduct asset & add INR to wallet
    (wallet as any)[targetField] = currentAssetBalance - amount;
    wallet.inrBalance = (wallet.inrBalance || 0) + expectedINR;
    await wallet.save();

    // Generate unique reference ID
    const refId = `SELL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create transaction log
    const transaction = await Transaction.create({
      userId,
      type: "sell",
      asset,
      amount,
      status: "completed",
      referenceId: refId,
    });

    // Process referral commission for sell transaction
    await processReferralCommissions({
      userId,
      transactionType: "sell",
      amountInINR: expectedINR,
      asset,
      referenceId: refId,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully sold ${amount} ${asset} for ₹${expectedINR.toFixed(2)} at rate ₹${currentRate}/${asset}.`,
      wallet: {
        inrBalance: wallet.inrBalance,
        usdtTrc20Balance: wallet.usdtTrc20Balance,
        usdtBep20Balance: wallet.usdtBep20Balance,
      },
      transaction: {
        referenceId: transaction.referenceId,
        amount,
        expectedINR,
        rate: currentRate,
      },
    });
  } catch (error: any) {
    console.error("Sell POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process sell request." },
      { status: 500 }
    );
  }
}
