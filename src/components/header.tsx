"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MobileSidebar } from "./mobile-sidebar";

interface HeaderProps {
  name: string;
  role: "parent" | "admin";
  loginTime?: number;
}

export function Header({ name, role, loginTime }: HeaderProps) {
  const router = useRouter();

  const loginDateStr = loginTime
    ? new Date(loginTime * 1000).toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      new Date(loginTime * 1000).toLocaleTimeString("en-AU", {
        timeZone: "Australia/Sydney",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <MobileSidebar role={role} />
          </SheetContent>
        </Sheet>

        <div className="text-sm text-muted-foreground">
          <span>
            Welcome, <span className="font-medium text-foreground">{name}</span>
          </span>
          {loginDateStr && (
            <span className="ml-3 hidden sm:inline">
              Logged in: {loginDateStr}
            </span>
          )}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </header>
  );
}
