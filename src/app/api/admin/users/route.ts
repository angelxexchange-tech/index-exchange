export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 }).lean();
    const wallets = await Wallet.find().lean();

    // Map wallets by userId
    const walletMap: Record<string, any> = {};
    wallets.forEach((w: any) => {
      walletMap[w.userId] = w;
    });

    const userList = users.map((u: any) => {
      const userWallet = walletMap[u.userId] || {
        inrBalance: 0,
        usdtTrc20Balance: 0,
        usdtBep20Balance: 0,
        levelIncome: 0,
        ltdIncome: 0,
        totalIncome: 0,
      };

      return {
        _id: u._id.toString(),
        userId: u.userId,
        name: u.name,
        mobileNumber: u.mobileNumber,
        email: u.email || "",
        referralId: u.referralId || "",
        isBlocked: !!u.isBlocked,
        blockedAt: u.blockedAt || null,
        blockReason: u.blockReason || "",
        createdAt: u.createdAt,
        wallet: {
          inrBalance: userWallet.inrBalance || 0,
          usdtTrc20Balance: userWallet.usdtTrc20Balance || 0,
          usdtBep20Balance: userWallet.usdtBep20Balance || 0,
          levelIncome: userWallet.levelIncome || 0,
          ltdIncome: userWallet.ltdIncome || 0,
          totalIncome: userWallet.totalIncome || 0,
        },
      };
    });

    return NextResponse.json({
      success: true,
      users: userList,
    });
  } catch (error: any) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch users.",
      },
      { status: 500 }
    );
  }
}
