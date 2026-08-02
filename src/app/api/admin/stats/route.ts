import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Total users
    const totalUsers = await User.countDocuments();

    // 2. All transactions
    const allTransactions = await Transaction.find().sort({ createdAt: -1 }).lean();

    // Calculate Deposit & Withdrawal sums
    let totalDepositsINR = 0;
    let totalDepositsUSDT = 0;
    let totalWithdrawalsINR = 0;
    let totalWithdrawalsUSDT = 0;
    let pendingDepositsCount = 0;
    let pendingWithdrawalsCount = 0;

    allTransactions.forEach((txn: any) => {
      if (txn.type === "deposit") {
        if (txn.status === "completed") {
          if (txn.asset === "USDT" || txn.asset === "USDT-BEP20") {
            totalDepositsUSDT += txn.amount || 0;
          } else {
            totalDepositsINR += txn.amount || 0;
          }
        } else if (txn.status === "pending") {
          pendingDepositsCount++;
        }
      } else if (txn.type === "withdrawal") {
        if (txn.status === "completed") {
          if (txn.asset === "USDT" || txn.asset === "USDT-BEP20") {
            totalWithdrawalsUSDT += txn.amount || 0;
          } else {
            totalWithdrawalsINR += txn.amount || 0;
          }
        } else if (txn.status === "pending") {
          pendingWithdrawalsCount++;
        }
      }
    });

    // 3. Wallets aggregate balances
    const allWallets = await Wallet.find().lean();
    let totalINRBalance = 0;
    let totalUSDTBalance = 0;
    let totalTRXBalance = 0;
    let totalBNBBalance = 0;

    allWallets.forEach((w: any) => {
      totalINRBalance += w.inrBalance || 0;
      totalUSDTBalance += (w.usdtBalance || 0) + (w.usdtBep20Balance || 0);
      totalTRXBalance += w.trxBalance || 0;
      totalBNBBalance += w.bnbBalance || 0;
    });

    // 4. Recent registered users (top 8)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(8).lean();

    // 5. Recent transactions (top 10)
    const recentTransactions = allTransactions.slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDepositsINR,
        totalDepositsUSDT,
        totalWithdrawalsINR,
        totalWithdrawalsUSDT,
        pendingDepositsCount,
        pendingWithdrawalsCount,
        totalPendingActions: pendingDepositsCount + pendingWithdrawalsCount,
        systemBalances: {
          inr: totalINRBalance,
          usdt: totalUSDTBalance,
          trx: totalTRXBalance,
          bnb: totalBNBBalance,
        },
      },
      recentUsers: recentUsers.map((u: any) => ({
        userId: u.userId,
        name: u.name,
        mobileNumber: u.mobileNumber,
        createdAt: u.createdAt,
      })),
      recentTransactions: recentTransactions.map((t: any) => ({
        _id: t._id.toString(),
        userId: t.userId,
        type: t.type,
        asset: t.asset,
        amount: t.amount,
        status: t.status,
        referenceId: t.referenceId,
        address: t.address || "",
        createdAt: t.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch admin stats.",
      },
      { status: 500 }
    );
  }
}
