import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SupportedBank from "@/models/SupportedBank";

export async function GET() {
  try {
    await connectToDatabase();

    const dbBanks = await SupportedBank.find({ isEnabled: true }).sort({ bankName: 1 }).lean();
    
    return NextResponse.json({
      success: true,
      banks: dbBanks.map((b: any) => ({
        _id: b._id.toString(),
        bankName: b.bankName,
        isEnabled: b.isEnabled,
      })),
    });
  } catch (error: any) {
    console.error("Banks GET Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch supported banks." },
      { status: 500 }
    );
  }
}
