export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const query: any = {};
    if (status && status !== "all") query.status = status;
    if (type && type !== "all") query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      transactions: transactions.map((t: any) => ({
        _id: t._id.toString(),
        userId: t.userId,
        type: t.type,
        asset: t.asset,
        amount: t.amount,
        status: t.status,
        address: t.address || "",
        referenceId: t.referenceId,
        createdAt: t.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Admin Transactions GET error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}
