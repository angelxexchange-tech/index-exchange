import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET(req: NextRequest) {
  try {
    // Set by middleware from the verified admin session
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Admin session expired. Please log in again." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ adminId }).lean();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Admin Session Check Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to check admin session." },
      { status: 500 }
    );
  }
}
