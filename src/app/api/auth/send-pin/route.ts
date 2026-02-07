import { NextRequest, NextResponse } from "next/server";
import { findFamilyByEmail } from "@/lib/sharepoint";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { isAdminEmail } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email exists as admin or in Family list
    const isAdmin = isAdminEmail(normalizedEmail);
    let familyRecord = null;

    if (!isAdmin) {
      familyRecord = await findFamilyByEmail(normalizedEmail);
      if (!familyRecord) {
        // Don't reveal whether email exists — always say "PIN sent"
        // but actually don't send. This prevents email enumeration.
        return NextResponse.json({
          message: "If your email is registered, you will receive a PIN shortly.",
        });
      }
    }

    // Generate OTP
    const otpResult = createOtp(normalizedEmail);
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error }, { status: 429 });
    }

    // Send email
    const emailResult = await sendOtpEmail(normalizedEmail, otpResult.pin);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If your email is registered, you will receive a PIN shortly.",
    });
  } catch (error) {
    console.error("send-pin error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
