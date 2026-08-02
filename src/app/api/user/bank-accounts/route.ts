import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import BankAccount from "@/models/BankAccount";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId parameter." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const accounts = await BankAccount.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      accounts: accounts.map((a: any) => ({
        _id: a._id.toString(),
        userId: a.userId,
        bankName: a.bankName,
        ifscCode: a.ifscCode,
        accountNumber: a.accountNumber,
        accountHolderName: a.accountHolderName,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("User Bank Accounts GET error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch bank accounts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bankName, ifscCode, accountNumber, accountHolderName } = body;

    if (!userId || !bankName || !ifscCode || !accountNumber || !accountHolderName) {
      return NextResponse.json(
        { success: false, message: "Please fill in all bank account details." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const newAccount = await BankAccount.create({
      userId,
      bankName: bankName.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      accountNumber: accountNumber.trim(),
      accountHolderName: accountHolderName.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Bank account added successfully!",
      account: {
        _id: newAccount._id.toString(),
        userId: newAccount.userId,
        bankName: newAccount.bankName,
        ifscCode: newAccount.ifscCode,
        accountNumber: newAccount.accountNumber,
        accountHolderName: newAccount.accountHolderName,
        createdAt: newAccount.createdAt,
      },
    });
  } catch (error: any) {
    console.error("User Bank Accounts POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add bank account." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing id or userId." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deleted = await BankAccount.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Bank account not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bank account deleted successfully.",
    });
  } catch (error: any) {
    console.error("User Bank Accounts DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete bank account." },
      { status: 500 }
    );
  }
}
