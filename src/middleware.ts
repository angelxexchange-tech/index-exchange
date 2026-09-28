import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/adminSession";

// Admin API routes that must work without a session
const PUBLIC_ADMIN_API_PATHS = ["/api/admin/auth/login", "/api/admin/auth/logout"];

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  // Only this middleware may say which admin is calling
  requestHeaders.delete("x-admin-id");

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/admin/") && !PUBLIC_ADMIN_API_PATHS.includes(pathname)) {
    const session = await verifyAdminSession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Admin session expired. Please log in again." },
        { status: 401 }
      );
    }
    requestHeaders.set("x-admin-id", session.adminId);
  }

  const userIdCookie = req.cookies.get("userId")?.value;

  const isProtectedUserRoute = [
    "/dashboard",
    "/deposit",
    "/deposit-history",
    "/deposit-report",
    "/deposit-usdt",
    "/sell",
    "/sell-history",
    "/transfer",
    "/transfer-report",
    "/withdraw",
    "/withdrawal",
    "/withdrawal-history",
    "/withdrawal-report",
    "/level-income-report",
    "/ltd-income-report",
    "/total-income-report",
    "/transaction-history",
    "/add-bank",
    "/add-bank-account",
  ].some((path) => req.nextUrl.pathname.startsWith(path));

  // During static page generation (build time), do not redirect static collection requests
  const isBuildPhase = req.headers.get("x-next-build") === "true";

  if (isProtectedUserRoute && (!userIdCookie || userIdCookie.trim() === "") && !isBuildPhase) {
    // Only redirect runtime browser requests, not internal build passes
    const isBrowserNavigation = req.headers.get("accept")?.includes("text/html");
    if (isBrowserNavigation) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
