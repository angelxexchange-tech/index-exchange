import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import DepositSetting from "@/models/DepositSetting";

export async function GET() {
  try {
    await connectToDatabase();

    const setting = await DepositSetting.findOne().lean();

    if (!setting) {
      return NextResponse.json({
        success: false,
        message: "Deposit details are not configured by Admin.",
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        network: setting.network,
        depositAddress: setting.depositAddress,
        qrImageData: setting.qrImageData,
        explorerUrl: setting.explorerUrl,
      },
    });
  } catch (error: any) {
    console.error("Deposit Settings GET Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch deposit settings." },
      { status: 500 }
    );
  }
}
