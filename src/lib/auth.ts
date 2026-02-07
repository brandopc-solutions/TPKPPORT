import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload, UserRole } from "@/types/auth";
import { SESSION_COOKIE, JWT_EXPIRY_HOURS } from "./constants";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Create a signed JWT for the given user
 */
export async function createSession(
  email: string,
  familyId: string | null,
  role: UserRole,
  name: string
): Promise<string> {
  const token = await new SignJWT({
    email,
    familyId,
    role,
    name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRY_HOURS}h`)
    .sign(secret());

  return token;
}

/**
 * Set the session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: JWT_EXPIRY_HOURS * 60 * 60,
    path: "/",
  });
}

/**
 * Get and verify the current session from cookies.
 * Returns null if no valid session.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Clear the session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Check if an email is in the admin allow-list
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase().trim());
}
