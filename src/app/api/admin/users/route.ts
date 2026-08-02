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
        trxBalance: 0,
        usdtBalance: 0,
        bnbBalance: 0,
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
        createdAt: u.createdAt,
        wallet: {
          inrBalance: userWallet.inrBalance || 0,
          trxBalance: userWallet.trxBalance || 0,
          usdtBalance: userWallet.usdtBalance || 0,
          bnbBalance: userWallet.bnbBalance || 0,
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
