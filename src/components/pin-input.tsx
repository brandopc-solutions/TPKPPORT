"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { OTP_LENGTH } from "@/lib/constants";

interface PinInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function PinInput({ value, onChange, disabled }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return;

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;

    const newValue = [...value];
    for (let i = 0; i < pasted.length; i++) {
      newValue[i] = pasted[i];
    }
    onChange(newValue);

    // Focus the next empty input or the last one
    const nextEmpty = newValue.findIndex((v) => !v);
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
