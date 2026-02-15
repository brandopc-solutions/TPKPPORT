import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiblingEnrollForm } from "@/components/sibling-enroll-form";

export default async function EnrollSiblingPage() {
  const session = await getSession();
  if (!session || !session.familyId) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enroll a Sibling</h1>
        <p className="text-muted-foreground">
          Fill in the details below to enroll a new student in your family
        </p>
      </div>

      <SiblingEnrollForm />
    </div>
  );
}
