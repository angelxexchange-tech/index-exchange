import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Rate from "@/models/Rate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rates } = body; // rates object: { USDT: 115, "USDT-BEP20": 118, ... }

    if (!rates || typeof rates !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid rates payload." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatePromises = Object.entries(rates).map(async ([asset, rate]) => {
      const numRate = Number(rate);
      if (isNaN(numRate) || numRate <= 0) return;
      return Rate.findOneAndUpdate(
        { asset },
        { rate: numRate },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updatePromises);

    const updatedRates = await Rate.find().lean();
    const rateMap: Record<string, number> = {};
    updatedRates.forEach((r: any) => {
      rateMap[r.asset] = r.rate;
    });

    return NextResponse.json({
      success: true,
      message: "Exchange rates updated successfully!",
      rates: rateMap,
    });
  } catch (error: any) {
    console.error("Admin Rates POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update rates." },
      { status: 500 }
    );
  }
}
