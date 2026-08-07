export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Rate from "@/models/Rate";

export async function GET() {
  try {
    await connectToDatabase();

    const dbRates = await Rate.find().lean();
    const rateMap: Record<string, number> = {};

    dbRates.forEach((r: any) => {
      rateMap[r.asset] = r.rate;
    });

    return NextResponse.json({
      success: true,
      rates: rateMap,
    });
  } catch (error: any) {
    console.error("Rates GET error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch rates." },
      { status: 500 }
    );
  }
}
