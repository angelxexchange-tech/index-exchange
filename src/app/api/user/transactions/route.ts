import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "deposit" | "withdrawal" | "sell" | "transfer"

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId parameter." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const txns = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      transactions: txns.map((t: any) => ({
        _id: t._id.toString(),
        referenceId: t.referenceId,
        userId: t.userId,
        type: t.type,
        asset: t.asset,
        amount: t.amount,
        status: t.status,
        address: t.address || "",
        createdAt: t.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("User Transactions GET Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch user transactions." },
      { status: 500 }
    );
  }
}
