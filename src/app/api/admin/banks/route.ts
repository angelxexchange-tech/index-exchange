export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SupportedBank from "@/models/SupportedBank";

export async function GET() {
  try {
    await connectToDatabase();
    const banks = await SupportedBank.find().sort({ bankName: 1 }).lean();
    return NextResponse.json({
      success: true,
      banks: banks.map((b: any) => ({
        _id: b._id.toString(),
        bankName: b.bankName,
        isEnabled: b.isEnabled,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch banks." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankName } = body;

    if (!bankName || typeof bankName !== "string" || bankName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter a valid bank name." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await SupportedBank.findOne({ bankName: bankName.trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Bank name already exists in system." },
        { status: 400 }
      );
    }

    const newBank = await SupportedBank.create({
      bankName: bankName.trim(),
      isEnabled: true,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${newBank.bankName} to supported banks!`,
      bank: {
        _id: newBank._id.toString(),
        bankName: newBank.bankName,
        isEnabled: newBank.isEnabled,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add bank." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankId, isEnabled } = body;

    if (!bankId) {
      return NextResponse.json(
        { success: false, message: "Missing bankId." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const bank = await SupportedBank.findById(bankId);
    if (!bank) {
      return NextResponse.json(
        { success: false, message: "Bank not found." },
        { status: 404 }
      );
    }

    bank.isEnabled = typeof isEnabled === "boolean" ? isEnabled : !bank.isEnabled;
    await bank.save();

    return NextResponse.json({
      success: true,
      message: `Bank ${bank.bankName} ${bank.isEnabled ? "enabled" : "disabled"}.`,
      bank: {
        _id: bank._id.toString(),
        bankName: bank.bankName,
        isEnabled: bank.isEnabled,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update bank." },
      { status: 500 }
    );
  }
}
