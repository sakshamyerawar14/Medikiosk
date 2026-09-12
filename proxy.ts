import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Initialize response
  const response = NextResponse.next();

  // 1. Comprehensive Healthcare Security Headers
  // Prevents Clickjacking, MIME-confusion, unauthorized framing, and forces HTTPS
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content Security Policy (allows local Next.js scripts, fonts, Gemini AI, Supabase API, and PDF/OCR web workers)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://cdn.jsdelivr.net;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // 2. Authentication & Role-Based Access Control (RBAC) Route Guards

  // A. Protect Doctor Portal Routes
  if (pathname.startsWith("/doctor") && pathname !== "/doctor/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const session = sessionCookie ? await verifySessionToken(sessionCookie.value) : null;

    if (!session) {
      const loginUrl = new URL("/doctor/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "doctor" && session.role !== "admin") {
      // Clinician access denied for other roles
      const loginUrl = new URL("/doctor/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(loginUrl);
    }
  }

  // B. Protect Administrator Portal Routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const session = sessionCookie ? await verifySessionToken(sessionCookie.value) : null;

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "admin") {
      // System administrator role strictly required
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "admin_required");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sample-docs).*)",
  ],
};
