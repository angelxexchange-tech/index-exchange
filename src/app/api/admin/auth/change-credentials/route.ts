import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import { ADMIN_COOKIE, adminCookieOptions, signAdminSession } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newAdminId, newPassword, newName } = body;
    // The account comes from the verified session (set by middleware), never from the request body
    const adminId = req.headers.get("x-admin-id");

    if (!adminId || !currentPassword) {
      return NextResponse.json(
        { success: false, message: "Missing current admin ID or password." },
        { status: 400 }
      );
    }

    const cleanCurrentPassword = currentPassword.trim();
    const cleanNewAdminId = newAdminId ? newAdminId.trim() : "";
    const cleanNewPassword = newPassword ? newPassword.trim() : "";
    const cleanNewName = newName ? newName.trim() : "";

    if (!cleanNewPassword && !cleanNewAdminId && !cleanNewName) {
      return NextResponse.json(
        { success: false, message: "Please provide at least one field to update (New Admin ID, New Password, or Name)." },
        { status: 400 }
      );
    }

    if (cleanNewPassword && cleanNewPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found." },
        { status: 404 }
      );
    }

    if (admin.password !== cleanCurrentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect. Access denied." },
        { status: 400 }
      );
    }

    // Check if new Admin ID is taken by another account
    if (cleanNewAdminId && cleanNewAdminId !== admin.adminId) {
      const existing = await Admin.findOne({ adminId: cleanNewAdminId });
      if (existing) {
        return NextResponse.json(
          { success: false, message: `Admin ID '${cleanNewAdminId}' is already taken.` },
          { status: 400 }
        );
      }
      admin.adminId = cleanNewAdminId;
    }

    if (cleanNewPassword) {
      admin.password = cleanNewPassword;
    }

    if (cleanNewName) {
      admin.name = cleanNewName;
    }

    await admin.save();

    const response = NextResponse.json({
      success: true,
      message: "Admin credentials updated successfully in MongoDB!",
      admin: {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    // Update cookie session if Admin ID changed
    response.cookies.set(ADMIN_COOKIE, await signAdminSession(admin.adminId), adminCookieOptions);

    return response;
  } catch (error: any) {
    console.error("Admin Credentials Update Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update admin credentials." },
      { status: 500 }
    );
  }
}
