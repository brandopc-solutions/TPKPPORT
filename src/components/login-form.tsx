"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PinInput } from "@/components/pin-input";
import { OTP_LENGTH } from "@/lib/constants";
import { Loader2, Mail, KeyRound } from "lucide-react";
import Image from "next/image";

type Step = "email" | "pin";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessage(data.message);
        setStep("pin");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const pinString = pin.join("");
    if (pinString.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin: pinString }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setPin(Array(OTP_LENGTH).fill(""));
      } else {
        router.push(data.redirectUrl);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setPin(Array(OTP_LENGTH).fill(""));
    setError("");
    setStep("email");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center pb-2">
          <Image src="/TPK_Logo.png" alt="TPK Logo" width={120} height={120} priority />
        </div>
        <CardTitle className="text-2xl">TPK Parent Portal</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email to receive a login PIN"
            : "Enter the 6-digit PIN sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={handleSendPin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send PIN
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Login PIN
              </Label>
              <PinInput value={pin} onChange={setPin} disabled={loading} />
            </div>

            {message && (
              <p className="text-sm text-muted-foreground text-center">
                {message}
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify PIN
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleResend}
              disabled={loading}
            >
              Use a different email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
