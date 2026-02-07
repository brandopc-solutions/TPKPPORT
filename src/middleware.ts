import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // Protected routes
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret());

    // Admin route but not admin role
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Parent trying to access admin routes
    if (pathname.startsWith("/admin") && payload.role === "parent") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token → clear cookie and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
