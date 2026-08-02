import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import DepositSetting from "@/models/DepositSetting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { depositAddress, qrImageData, network, explorerUrl } = body;

    if (!depositAddress || typeof depositAddress !== "string" || depositAddress.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter a valid deposit wallet address." },
        { status: 400 }
      );
    }

    if (!qrImageData || typeof qrImageData !== "string") {
      return NextResponse.json(
        { success: false, message: "Please upload a QR Code image file." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let setting = await DepositSetting.findOne();
    if (!setting) {
      setting = new DepositSetting({
        depositAddress: depositAddress.trim(),
        qrImageData,
        network: network?.trim() || "TRON Network (TRC20)",
        explorerUrl: explorerUrl?.trim() || "https://tronscan.org",
      });
    } else {
      setting.depositAddress = depositAddress.trim();
      setting.qrImageData = qrImageData;
      setting.network = network?.trim() || "TRON Network (TRC20)";
      setting.explorerUrl = explorerUrl?.trim() || "https://tronscan.org";
    }

    await setting.save();

    return NextResponse.json({
      success: true,
      message: "Deposit QR Code and TRC20 Wallet Address updated successfully in MongoDB!",
      settings: {
        network: setting.network,
        depositAddress: setting.depositAddress,
        qrImageData: setting.qrImageData,
        explorerUrl: setting.explorerUrl,
      },
    });
  } catch (error: any) {
    console.error("Admin Deposit Settings POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update deposit settings." },
      { status: 500 }
    );
  }
}
