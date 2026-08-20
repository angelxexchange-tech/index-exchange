import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== "string" || identifier.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter your Mobile Number or User ID." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter your Password." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    await connectToDatabase();

    // Search user by either userId or mobileNumber
    const user = await User.findOne({
      $or: [{ userId: cleanIdentifier }, { mobileNumber: cleanIdentifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Please check your User ID / Mobile Number." },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          message: "Your account has been blocked. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Verify password
    if (user.password !== cleanPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    const userObj = user.toObject();

    return NextResponse.json(
      {
        success: true,
        user: {
          userId: userObj.userId,
          name: userObj.name,
          mobileNumber: userObj.mobileNumber,
        },
        message: "Login successful!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during login.",
      },
      { status: 500 }
    );
  }
}
