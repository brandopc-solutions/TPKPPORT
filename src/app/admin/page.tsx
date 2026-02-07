import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getListItems } from "@/lib/sharepoint";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, UserCog } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  // Fetch counts
  let familyCount = 0;
  let studentCount = 0;
  try {
    const families = await getListItems(process.env.FAMILY_LIST_ID!);
    const students = await getListItems(process.env.STUDENTS_LIST_ID!);
    familyCount = families.length;
    studentCount = students.length;
  } catch {
    // If SharePoint not configured, show 0
  }

  const stats = [
    {
      title: "Total Families",
      value: familyCount,
      href: "/admin/families",
      icon: <Users className="h-6 w-6" />,
      description: "Registered families",
    },
    {
      title: "Total Students",
      value: studentCount,
      href: "/admin/students",
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Enrolled students",
    },
    {
      title: "Admin Settings",
      value: null,
      href: "/admin/settings",
      icon: <UserCog className="h-6 w-6" />,
      description: "Manage configuration",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the language school portal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  {stat.icon}
                </div>
                <CardTitle className="text-base">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {stat.value !== null && (
                  <p className="text-3xl font-bold">{stat.value}</p>
                )}
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
