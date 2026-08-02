import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import twilio from "twilio";

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
    const body = await req.json();
    const { identifier } = body;

    if (!identifier || typeof identifier !== "string" || identifier.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter your Mobile Number or User ID." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ userId: cleanIdentifier }, { mobileNumber: cleanIdentifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No registered account found with these details." },
        { status: 404 }
      );
    }

    const userObj = user.toObject();

    let smsSent = false;
    let smsError = "";

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhone) {
      try {
        const client = twilio(accountSid, authToken);
        const formattedTo = formatPhoneNumber(userObj.mobileNumber);
        const smsMessage = `Ind-X Password Recovery:\nHello ${userObj.name},\nUser ID: ${userObj.userId}\nPassword: ${userObj.password}\nPlease keep your credentials safe.`;

        await client.messages.create({
          body: smsMessage,
          from: twilioPhone,
          to: formattedTo,
        });

        smsSent = true;
      } catch (err: any) {
        console.error("Twilio SMS Error:", err);
        smsError = err?.message || "Failed to send SMS via Twilio";
      }
    } else {
      smsError = "Twilio credentials missing in environment variables.";
    }

    return NextResponse.json(
      {
        success: true,
        smsSent,
        smsError: smsSent ? undefined : smsError,
        message: smsSent
          ? "Your credentials have been sent to your registered mobile number via SMS."
          : "Account found! However, SMS delivery failed. Please check Twilio configuration.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during password recovery.",
      },
      { status: 500 }
    );
  }
}
