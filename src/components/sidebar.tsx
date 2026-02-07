"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  GraduationCap,
  CalendarDays,
  CreditCard,
  Home,
  LayoutDashboard,
  UserCog,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const parentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Family", href: "/dashboard/family", icon: <Users className="h-4 w-4" /> },
  { label: "Students", href: "/dashboard/students", icon: <GraduationCap className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Families", href: "/admin/families", icon: <Users className="h-4 w-4" /> },
  { label: "Students", href: "/admin/students", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Admin Settings", href: "/admin/settings", icon: <UserCog className="h-4 w-4" /> },
];

interface SidebarProps {
  role: "parent" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNav : parentNav;

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={role === "admin" ? "/admin" : "/dashboard"} className="font-bold text-lg">
          TPK Parent Portal
        </Link>
      </div>
      <nav className="flex flex-col flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === pathname ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <div className="flex justify-center pt-4">
          <Image src="/TPK_Logo.png" alt="TPK Logo" width={160} height={160} />
        </div>
      </nav>
    </aside>
  );
}
