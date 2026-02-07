import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getListItem, getStudentsByFamilyId } from "@/lib/sharepoint";
import {
  mapFromSharePoint,
  FAMILY_FIELD_MAP,
  STUDENT_FIELD_MAP,
} from "@/lib/field-maps";
import { Family } from "@/types/family";
import { Student } from "@/types/student";
import { FamilyForm } from "@/components/family-form";
import { StudentCard } from "@/components/student-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminFamilyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  let rawFamily;
  try {
    rawFamily = await getListItem(process.env.FAMILY_LIST_ID!, id);
  } catch {
    notFound();
  }

  const family: Family = {
    id: rawFamily.id as string,
    ...mapFromSharePoint<Omit<Family, "id">>(rawFamily, FAMILY_FIELD_MAP),
  };

  // Get linked students
  const rawStudents = await getStudentsByFamilyId(id);
  const students: Student[] = rawStudents.map((raw) => ({
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(raw, STUDENT_FIELD_MAP),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/families">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {family.p1FullName || `${family.p1FirstName} ${family.p1LastName}`}
          </h1>
          <p className="text-muted-foreground">Family ID: {family.title}</p>
        </div>
      </div>

      <FamilyForm family={family} />

      <Separator />

      <div>
        <h2 className="text-xl font-bold mb-4">
          Students ({students.length})
        </h2>
        {students.length === 0 ? (
          <p className="text-muted-foreground">
            No students linked to this family.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                basePath="/admin/students"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
