import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminOtpError, issueAdminOtp } from "@/lib/adminOtp";
import {
  depositChangeFingerprint,
  depositChangeSummary,
  depositQrAttachment,
  parseDepositChange,
} from "@/lib/depositSettings";

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

    const change = parseDepositChange(await req.json());
    if (typeof change === "string") {
      return NextResponse.json({ success: false, message: change }, { status: 400 });
    }

    await connectToDatabase();

    const maskedEmail = await issueAdminOtp({
      adminId,
      purpose: "deposit-settings",
      fingerprint: depositChangeFingerprint(change),
      summary: depositChangeSummary(change),
      attachments: [depositQrAttachment(change)],
    });

    return NextResponse.json({
      success: true,
      maskedEmail,
      message: `Verification code sent to ${maskedEmail}.`,
    });
  } catch (error: any) {
    if (error instanceof AdminOtpError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error("Admin Deposit Settings OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send verification code." },
      { status: 500 }
    );
  }
}
