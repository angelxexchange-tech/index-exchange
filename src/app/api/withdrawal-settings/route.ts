export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import WithdrawalSetting from "@/models/WithdrawalSetting";

export async function GET() {
  try {
    await connectToDatabase();

    const setting = await WithdrawalSetting.findOne().lean();

    if (!setting) {
      return NextResponse.json({
        success: false,
        message: "Withdrawal limits are not configured by Admin.",
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        minAmount: setting.minAmount,
        maxAmount: setting.maxAmount,
        feePercentage: setting.feePercentage || 0,
      },
    });
  } catch (error: any) {
    console.error("Withdrawal Settings GET Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch withdrawal settings." },
      { status: 500 }
    );
  }
}
