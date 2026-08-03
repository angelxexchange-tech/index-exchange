import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ReferralSetting from "@/models/ReferralSetting";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let settings = await ReferralSetting.findOne().lean();

    if (!settings) {
      const created = await ReferralSetting.create({
        levels: [
          { level: 1, percentage: 5 },
          { level: 2, percentage: 3 },
          { level: 3, percentage: 1 },
        ],
        isDepositCommissionEnabled: true,
        isSellCommissionEnabled: true,
      });
      settings = created.toObject();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("GET referral settings error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch referral settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { levels, isDepositCommissionEnabled, isSellCommissionEnabled } = body;

    if (!Array.isArray(levels)) {
      return NextResponse.json(
        { success: false, message: "levels must be an array." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let settings = await ReferralSetting.findOne();
    if (!settings) {
      settings = new ReferralSetting({
        levels,
        isDepositCommissionEnabled: isDepositCommissionEnabled ?? true,
        isSellCommissionEnabled: isSellCommissionEnabled ?? true,
      });
    } else {
      settings.levels = levels;
      if (typeof isDepositCommissionEnabled === "boolean") {
        settings.isDepositCommissionEnabled = isDepositCommissionEnabled;
      }
      if (typeof isSellCommissionEnabled === "boolean") {
        settings.isSellCommissionEnabled = isSellCommissionEnabled;
      }
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      message: "Referral commission settings updated successfully!",
      settings,
    });
  } catch (error: any) {
    console.error("POST referral settings error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update referral settings." },
      { status: 500 }
    );
  }
}
