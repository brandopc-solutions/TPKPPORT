import { OtpEntry } from "@/types/auth";
import {
  OTP_LENGTH,
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_COOLDOWN_SECONDS,
} from "./constants";

// In-memory OTP store (suitable for single-server deployment)
const otpStore = new Map<string, OtpEntry>();

/**
 * Generate a random numeric PIN of specified length
 */
function generatePin(): string {
  const digits = [];
  for (let i = 0; i < OTP_LENGTH; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  return digits.join("");
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpired(): void {
  const now = Date.now();
  for (const [email, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpired, 5 * 60 * 1000);

export type OtpResult =
  | { success: true; pin: string }
  | { success: false; error: string };

/**
 * Create and store a new OTP for the given email.
 * Returns the PIN or an error if rate-limited.
 */
export function createOtp(email: string): OtpResult {
  const key = email.toLowerCase().trim();
  const now = Date.now();

  // Check cooldown
  const existing = otpStore.get(key);
  if (existing) {
    const cooldownEnd = existing.lastSentAt + OTP_COOLDOWN_SECONDS * 1000;
    if (now < cooldownEnd) {
      const waitSeconds = Math.ceil((cooldownEnd - now) / 1000);
      return {
        success: false,
        error: `Please wait ${waitSeconds} seconds before requesting a new PIN.`,
      };
    }
  }

  const pin = generatePin();
  otpStore.set(key, {
    pin,
    expiresAt: now + OTP_EXPIRY_MINUTES * 60 * 1000,
    attempts: 0,
    lastSentAt: now,
  });

  return { success: true, pin };
}

export type VerifyResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Verify a PIN for the given email.
 * Returns success or error (expired, wrong, max attempts).
 */
export function verifyOtp(email: string, pin: string): VerifyResult {
  const key = email.toLowerCase().trim();
  const entry = otpStore.get(key);

  if (!entry) {
    return { success: false, error: "No PIN found. Please request a new one." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return { success: false, error: "PIN has expired. Please request a new one." };
  }

  if (entry.attempts >= OTP_MAX_ATTEMPTS) {
    otpStore.delete(key);
    return {
      success: false,
      error: "Too many incorrect attempts. Please request a new PIN.",
    };
  }

  if (entry.pin !== pin.trim()) {
    entry.attempts++;
    return {
      success: false,
      error: `Incorrect PIN. ${OTP_MAX_ATTEMPTS - entry.attempts} attempts remaining.`,
    };
  }

  // Success — remove OTP so it can't be reused
  otpStore.delete(key);
  return { success: true };
}
