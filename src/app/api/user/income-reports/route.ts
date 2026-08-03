import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Wallet from "@/models/Wallet";
import IncomeLog from "@/models/IncomeLog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "level" | "ltd" | "all"

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId parameter is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const wallet = await Wallet.findOne({ userId });

    const filter: any = { userId };
    if (type && type !== "all") {
      filter.type = type;
    }

    const logs = await IncomeLog.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      wallet: {
        levelIncome: wallet?.levelIncome || 0,
        ltdIncome: wallet?.ltdIncome || 0,
        totalIncome: wallet?.totalIncome || 0,
      },
      logs,
    });
  } catch (error: any) {
    console.error("Income reports error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch income reports." },
      { status: 500 }
    );
  }
}
