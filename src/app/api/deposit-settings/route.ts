import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import DepositSetting from "@/models/DepositSetting";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const assetParam = searchParams.get("asset");
    const asset = assetParam === "USDT-BEP20" ? "USDT-BEP20" : "USDT";

    const setting = await DepositSetting.findOne({ asset }).lean();

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
