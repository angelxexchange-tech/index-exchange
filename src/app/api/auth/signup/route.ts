import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
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

// Helper function to generate unique User ID (e.g. IDX + 6 digits)
async function generateUniqueUserId(): Promise<string> {
  let isUnique = false;
  let customUserId = "";

  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    customUserId = `IDX${randomDigits}`;
    const existing = await User.findOne({ userId: customUserId });
    if (!existing) {
      isUnique = true;
    }
  }

  return customUserId;
}

// Helper function to generate 8-digit random numeric password
function generateRandomNumericPassword(length = 8): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referralId, name, mobileNumber } = body;

    // Validate inputs
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (!mobileNumber || typeof mobileNumber !== "string" || mobileNumber.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Mobile number is required." },
        { status: 400 }
      );
    }

    const cleanMobile = mobileNumber.trim();
    const cleanName = name.trim();

    // Format initial default email to store in MongoDB
    const defaultEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`;

    // Connect to Database
    await connectToDatabase();

    // Check if user with this mobile number already exists
    const existingUser = await User.findOne({ mobileNumber: cleanMobile });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this mobile number already exists. Please login instead.",
        },
        { status: 400 }
      );
    }

    // Generate unique user ID and 8-digit numeric password
    const userId = await generateUniqueUserId();
    const generatedPassword = generateRandomNumericPassword(8);

    // Create user in DB with initial email and numeric password
    const newUser = await User.create({
      userId,
      name: cleanName,
      mobileNumber: cleanMobile,
      email: defaultEmail,
      password: generatedPassword,
      referralId: referralId ? referralId.trim() : "",
    });

    // Auto-create linked wallet for the new user
    await Wallet.create({
      userId,
      inrBalance: 0,
      usdtBalance: 0,
      usdtBep20Balance: 0,
      levelIncome: 0,
      ltdIncome: 0,
      totalIncome: 0,
    });

    const userObj = newUser.toObject();

    // Send SMS via Twilio
    let smsSent = false;
    let smsError = "";

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhone) {
      try {
        const client = twilio(accountSid, authToken);
        const formattedTo = formatPhoneNumber(cleanMobile);
        const smsMessage = `Welcome to Ind-X, ${userObj.name}!\nYour account is created.\nUser ID: ${userObj.userId}\nPassword: ${generatedPassword}\nPlease keep your credentials safe.`;

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
      console.warn("Twilio credentials not configured properly in .env");
      smsError = "Twilio credentials missing in environment variables.";
    }

    return NextResponse.json(
      {
        success: true,
        userId: userObj.userId,
        password: generatedPassword,
        name: userObj.name,
        mobileNumber: userObj.mobileNumber,
        email: userObj.email,
        smsSent,
        smsError: smsSent ? undefined : smsError,
        message: "User registered successfully!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during registration.",
      },
      { status: 500 }
    );
  }
}
