import { type NextRequest, NextResponse } from "next/server";
import { decodeSession } from "./lib/session"; // ✅ now safe

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = decodeSession(req.cookies.get("session")?.value);

  const isAuthPage = ["/login", "/register", "/admin-login"].includes(pathname);
  const isUserProtected = ["/dashboard", "/profile"].includes(pathname);
  const isAdminProtected = ["/admin", "/create-event"].includes(pathname);

  if (isAuthPage && session) {
    const dest = session.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (isUserProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminProtected) {
    if (!session)
      return NextResponse.redirect(new URL("/admin-login", req.url));
    if (process.env.SECURITY_MODE === "secure" && session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin-login",
    "/dashboard",
    "/profile",
    "/admin",
    "/create-event",
  ],
};
