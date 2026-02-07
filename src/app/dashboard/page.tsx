import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, CalendarDays, CreditCard } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const cards = [
    {
      title: "Family",
      description: "View and update your family information",
      href: "/dashboard/family",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Students",
      description: "View your children's enrollment details",
      href: "/dashboard/students",
      icon: <GraduationCap className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.name}. Manage your family and student information below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  {card.icon}
                </div>
                <CardTitle className="text-base">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
