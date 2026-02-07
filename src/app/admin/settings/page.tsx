import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Portal configuration and management.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Admin settings will be available in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Current admin: {session.email}</p>
            <p>
              Admin emails are configured via the <code>ADMIN_EMAILS</code>{" "}
              environment variable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
