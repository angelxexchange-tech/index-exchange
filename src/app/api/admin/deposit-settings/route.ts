import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import DepositSetting from "@/models/DepositSetting";
import { AdminOtpError, consumeAdminOtp, getAdminOtpEmail } from "@/lib/adminOtp";
import { depositChangeFingerprint, parseDepositChange } from "@/lib/depositSettings";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    // Set by middleware from the verified admin session
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Admin session expired. Please log in again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const change = parseDepositChange(body);
    if (typeof change === "string") {
      return NextResponse.json({ success: false, message: change }, { status: 400 });
    }

    await connectToDatabase();

    // The email OTP must have been issued for exactly this change
    await consumeAdminOtp({
      adminId,
      purpose: "deposit-settings",
      fingerprint: depositChangeFingerprint(change),
      code: body.otp,
    });

    let setting = await DepositSetting.findOne({ asset: change.asset });
    if (!setting) {
      setting = new DepositSetting({
        asset: change.asset,
        depositAddress: change.depositAddress,
        qrImageData: change.qrImageData,
        network: change.network,
        explorerUrl: change.explorerUrl,
      });
    } else {
      setting.depositAddress = change.depositAddress;
      setting.qrImageData = change.qrImageData;
      setting.network = change.network;
      setting.explorerUrl = change.explorerUrl;
    }

    await setting.save();

    try {
      await sendMail({
        to: getAdminOtpEmail(),
        subject: `Deposit address changed for ${change.asset}`,
        text: [
          `The ${change.asset} deposit settings were changed by admin "${adminId}" at ${new Date().toISOString()}.`,
          ``,
          `New wallet address: ${change.depositAddress}`,
          ``,
          `If this was not you, log in and restore the correct address immediately.`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("Deposit settings confirmation email error:", err);
    }

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
    if (error instanceof AdminOtpError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error("Admin Deposit Settings POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update deposit settings." },
      { status: 500 }
    );
  }
}
