import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, blocked, reason } = body;

    if (!userId || typeof userId !== "string" || typeof blocked !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid parameters. Required: userId, blocked (boolean)." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ userId: userId.trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: `User ID ${userId} not found.` },
        { status: 404 }
      );
    }

    user.isBlocked = blocked;
    user.blockedAt = blocked ? new Date() : null;
    user.blockReason = blocked ? (typeof reason === "string" ? reason.trim() : "") : "";
    await user.save();

    return NextResponse.json({
      success: true,
      message: `User ${user.userId} has been ${blocked ? "blocked" : "unblocked"}.`,
      user: {
        userId: user.userId,
        isBlocked: user.isBlocked,
        blockedAt: user.blockedAt,
        blockReason: user.blockReason,
      },
    });
  } catch (error: any) {
    console.error("User block/unblock error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update user status." },
      { status: 500 }
    );
  }
}
