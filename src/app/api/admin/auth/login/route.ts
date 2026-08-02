import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminId, password } = body;

    if (!adminId || typeof adminId !== "string" || adminId.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Please enter Admin ID." },
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

    // Check if default admin exists in DB, if not auto-seed default superadmin
    let admin = await Admin.findOne({ adminId: cleanAdminId });

    if (!admin && cleanAdminId === "admin") {
      // Auto seed default admin
      admin = await Admin.create({
        adminId: "admin",
        name: "Super Admin",
        email: "admin@indexexchange.com",
        password: "admin123",
        role: "superadmin",
      });
    }

    if (!admin) {
      // Direct credential fallback check if db write failed or custom credentials
      if (cleanAdminId === "admin" && cleanPassword === "admin123") {
        const response = NextResponse.json(
          {
            success: true,
            admin: {
              adminId: "admin",
              name: "Super Admin",
              email: "admin@indexexchange.com",
              role: "superadmin",
            },
            message: "Admin Login Successful!",
          },
          { status: 200 }
        );

        response.cookies.set("adminToken", "admin_authenticated_session_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }

      return NextResponse.json(
        { success: false, message: "Invalid Admin ID or Password." },
        { status: 401 }
      );
    }

    if (admin.password !== cleanPassword) {
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

    response.cookies.set("adminToken", `admin_session_${admin.adminId}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

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
