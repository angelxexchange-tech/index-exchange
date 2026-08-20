import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam || userIdParam.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. User ID is required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ userId: userIdParam.trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. User not found." },
        { status: 401 }
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

    let wallet = await Wallet.findOne({ userId: user.userId });

    // Auto-create wallet if missing
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user.userId,
        inrBalance: 0,
        usdtTrc20Balance: 0,
        usdtBep20Balance: 0,
        levelIncome: 0,
        ltdIncome: 0,
        totalIncome: 0,
      });
    }

    const userObj = user.toObject();
    const walletObj = wallet.toObject();

    return NextResponse.json(
      {
        success: true,
        user: {
          userId: userObj.userId,
          name: userObj.name,
          mobileNumber: userObj.mobileNumber,
          email: userObj.email || "",
        },
        wallet: {
          inrBalance: walletObj.inrBalance,
          usdtTrc20Balance: walletObj.usdtTrc20Balance,
          usdtBep20Balance: walletObj.usdtBep20Balance,
          levelIncome: walletObj.levelIncome,
          ltdIncome: walletObj.ltdIncome,
          totalIncome: walletObj.totalIncome,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch User Me Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error fetching profile.",
      },
      { status: 500 }
    );
  }
}
