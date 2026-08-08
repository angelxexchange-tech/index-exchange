import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import twilio from "twilio";

// Helper function to format phone number to E.164 standard required by Twilio
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return `+${cleaned}`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otpCode;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhone) {
      try {
        const client = twilio(accountSid, authToken);
        const formattedPhone = formatPhoneNumber(user.mobileNumber);

        await client.messages.create({
          body: `Your Index Exchange verification code is: ${otpCode}. It expires in 10 minutes.`,
          from: twilioPhone,
          to: formattedPhone,
        });
      } catch (err: any) {
        console.error("Twilio SMS Error in Transfer OTP:", err);
        return NextResponse.json({ success: false, message: "Failed to send OTP SMS. Please try again later." }, { status: 500 });
      }
    } else {
      console.warn("Twilio credentials not configured. OTP generated but not sent via SMS.");
      // In development, you might want to return it or just fail
      return NextResponse.json({ success: false, message: "SMS Gateway not configured." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
