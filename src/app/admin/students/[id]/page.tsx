import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getListItem } from "@/lib/sharepoint";
import { mapFromSharePoint, STUDENT_FIELD_MAP } from "@/lib/field-maps";
import { Student } from "@/types/student";
import { StudentForm } from "@/components/student-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminStudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  let rawStudent;
  try {
    rawStudent = await getListItem(process.env.STUDENTS_LIST_ID!, id);
  } catch {
    notFound();
  }

  const student: Student = {
    id: rawStudent.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(rawStudent, STUDENT_FIELD_MAP),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-muted-foreground">
            Student ID: {student.title} | Roll No: {student.rollNumber}
          </p>
        </div>
      </div>

      <StudentForm student={student} />
    </div>
  );
}
