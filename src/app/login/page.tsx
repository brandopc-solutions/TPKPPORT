import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <LoginForm />
    </div>
  );
}
