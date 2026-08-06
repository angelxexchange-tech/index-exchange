import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Wallet from "@/models/Wallet";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, asset, action, amount } = body;

    if (!userId || !asset || !action || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters. Required: userId, asset, action (credit/debit), amount > 0" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: `User ID ${userId} not found.` },
        { status: 404 }
      );
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId });
    }

    const fieldMap: Record<string, keyof typeof wallet> = {
      INR: "inrBalance",
      USDT: "usdtBalance",
      "USDT-BEP20": "usdtBep20Balance",
      
    };

    const targetField = fieldMap[asset.toUpperCase()];
    if (!targetField) {
      return NextResponse.json(
        { success: false, message: `Unsupported asset: ${asset}` },
        { status: 400 }
      );
    }

    const currentVal = (wallet[targetField] as number) || 0;
    let newVal = currentVal;

    if (action === "credit") {
      newVal = currentVal + amount;
    } else if (action === "debit") {
      newVal = Math.max(0, currentVal - amount);
    } else {
      return NextResponse.json(
        { success: false, message: "Action must be 'credit' or 'debit'." },
        { status: 400 }
      );
    }

    (wallet as any)[targetField] = newVal;
    await wallet.save();

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${amount} ${asset} for user ${userId}.`,
      wallet: {
        userId: wallet.userId,
        inrBalance: wallet.inrBalance,
        usdtBalance: wallet.usdtBalance,
        trxBalance: wallet.trxBalance,
        bnbBalance: wallet.bnbBalance,
      },
    });
  } catch (error: any) {
    console.error("Balance adjustment error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to adjust balance." },
      { status: 500 }
    );
  }
}
