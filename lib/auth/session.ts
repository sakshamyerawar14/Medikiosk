import { cookies } from "next/headers";
import { Role } from "@/types";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  departmentId?: string | null;
}

export interface SessionPayload extends SessionUser {
  exp: number; // Expiration timestamp in seconds
  iat: number; // Issued at timestamp in seconds
}

export const SESSION_COOKIE_NAME = "medikiosk_session";
const DEFAULT_SESSION_DURATION_SEC = 8 * 60 * 60; // 8 hours

// Secure key retrieval for HMAC signing
function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "medikiosk-secure-default-session-salt-do-not-use-in-production-without-env"
  );
}

// Convert string to Uint8Array for Web Crypto API
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64URL encoding/decoding for safe cookie transport
function base64UrlEncode(data: Uint8Array): string {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += String.fromCharCode(data[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Signs a payload with HMAC-SHA256 using standard Web Crypto API
 * Works across Edge runtime (Middleware), Server Actions, and Node.js
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getSessionSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(secret) as any,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payloadJson = JSON.stringify(payload);
  const payloadBytes = stringToUint8Array(payloadJson);
  const payloadB64 = base64UrlEncode(payloadBytes);

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToUint8Array(payloadB64) as any
  );

  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;

  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) return null;

  try {
    const secret = getSessionSecret();
    const key = await crypto.subtle.importKey(
      "raw",
      stringToUint8Array(secret) as any,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as any,
      stringToUint8Array(payloadB64) as any
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson) as SessionPayload;

    // Check expiration
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to create a verified session cookie
 */
export async function createSessionCookie(user: SessionUser): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...user,
    iat: nowSec,
    exp: nowSec + DEFAULT_SESSION_DURATION_SEC,
  };

  const token = await signSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEFAULT_SESSION_DURATION_SEC,
  });

  return token;
}

/**
 * Server-side helper to read and verify the active session
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;

    return await verifySessionToken(cookie.value);
  } catch {
    return null;
  }
}

/**
 * Server-side helper to clear the session cookie
 */
export async function destroySessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {}
}

/**
 * Server action guard: requires authentication and optionally a specific role
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<{
  authorized: boolean;
  user?: SessionPayload;
  error?: string;
}> {
  const session = await getSession();

  if (!session) {
    return { authorized: false, error: "Authentication required. Please sign in." };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return {
      authorized: false,
      user: session,
      error: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
    };
  }

  return { authorized: true, user: session };
}
