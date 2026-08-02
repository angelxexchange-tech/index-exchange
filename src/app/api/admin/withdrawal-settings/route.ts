import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import WithdrawalSetting from "@/models/WithdrawalSetting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { minAmount, maxAmount, feePercentage } = body;

    const numMin = Number(minAmount);
    const numMax = Number(maxAmount);
    const numFee = Number(feePercentage || 0);

    if (isNaN(numMin) || isNaN(numMax) || numMin < 0 || numMax <= numMin) {
      return NextResponse.json(
        { success: false, message: "Invalid min/max limits. Max limit must be greater than Min limit." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let setting = await WithdrawalSetting.findOne();
    if (!setting) {
      setting = new WithdrawalSetting({
        minAmount: numMin,
        maxAmount: numMax,
        feePercentage: numFee,
      });
    } else {
      setting.minAmount = numMin;
      setting.maxAmount = numMax;
      setting.feePercentage = numFee;
    }

    await setting.save();

    return NextResponse.json({
      success: true,
      message: "Withdrawal limits updated successfully!",
      settings: {
        minAmount: setting.minAmount,
        maxAmount: setting.maxAmount,
        feePercentage: setting.feePercentage,
      },
    });
  } catch (error: any) {
    console.error("Admin Withdrawal Settings POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update withdrawal limits." },
      { status: 500 }
    );
  }
}
