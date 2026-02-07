import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { createSession, setSessionCookie, isAdminEmail } from "@/lib/auth";
import { findFamilyByEmail } from "@/lib/sharepoint";

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();

    if (!email || !pin) {
      return NextResponse.json(
        { error: "Email and PIN are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP
    const result = verifyOtp(normalizedEmail, pin);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Determine role and get family info
    const isAdmin = isAdminEmail(normalizedEmail);
    let familyId: string | null = null;
    let name = "Admin";

    if (isAdmin) {
      familyId = null;
      name = "Administrator";
    } else {
      const family = await findFamilyByEmail(normalizedEmail);
      if (!family) {
        return NextResponse.json(
          { error: "Account not found." },
          { status: 404 }
        );
      }
      familyId = family.id as string;

      // Determine which parent this is (field_12 = p2 first name, field_16 = p2 email)
      const p1Email = ((family.f_p1_email as string) || "").toLowerCase().trim();
      if (p1Email === normalizedEmail) {
        name = (family.f_p1_FullName as string) || (family.f_p1_fName as string) || "Parent";
      } else {
        name = (family.f_p2_FullName as string) || (family.field_12 as string) || "Parent";
      }
    }

    // Create JWT and set cookie
    const role = isAdmin ? "admin" : "parent";
    const token = await createSession(normalizedEmail, familyId, role, name);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      role,
      name,
      redirectUrl: isAdmin ? "/admin" : "/dashboard",
    });
  } catch (error) {
    console.error("verify-pin error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
