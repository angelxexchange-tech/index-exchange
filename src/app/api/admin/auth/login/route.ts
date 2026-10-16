import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import { ADMIN_COOKIE, adminCookieOptions, signAdminSession } from "@/lib/adminSession";

import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminId, password } = body;

    if (!adminId || typeof adminId !== "string" || adminId.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter Admin ID or Email." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter Password." },
        { status: 400 }
      );
    }

    const cleanAdminId = adminId.trim();
    const cleanPassword = password.trim();

    await connectToDatabase();

    // Admin accounts are created manually in the database; allow login via Admin ID or Email
    const admin = await Admin.findOne({
      $or: [
        { adminId: cleanAdminId },
        { email: cleanAdminId.toLowerCase() },
      ],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin ID or Password." },
        { status: 401 }
      );
    }

    let isMatch = false;
    if (admin.password) {
      if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
        isMatch = await bcrypt.compare(cleanPassword, admin.password);
      } else {
        // Fallback for legacy plaintext password, then auto-upgrade to bcrypt hash
        isMatch = admin.password === cleanPassword;
        if (isMatch) {
          admin.password = await bcrypt.hash(cleanPassword, 12);
          await admin.save();
        }
      }
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid Password. Access Denied." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        admin: {
          adminId: admin.adminId,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        message: "Admin Login Successful!",
      },
      { status: 200 }
    );

    response.cookies.set(ADMIN_COOKIE, await signAdminSession(admin.adminId), adminCookieOptions);

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during admin login.",
      },
      { status: 500 }
    );
  }
}
