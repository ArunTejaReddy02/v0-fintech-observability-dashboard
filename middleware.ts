import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isLoginPage = pathname === "/login";
  
  const isProtectedPage = pathname === "/";
  const isProtectedApi = 
    pathname.startsWith("/api/alerts") ||
    pathname.startsWith("/api/assets") ||
    pathname.startsWith("/api/workers") ||
    pathname.startsWith("/api/metrics") ||
    pathname.startsWith("/api/organizations");

  let isAuthenticated = false;

  if (token) {
    try {
      const secret = getSecretKey();
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAuthenticated) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isProtectedApi && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
