export type UserRole = "parent" | "admin";

export interface SessionPayload {
  email: string;
  familyId: string | null;
  role: UserRole;
  name: string;
  iat: number;
  exp: number;
}

export interface OtpEntry {
  pin: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}
