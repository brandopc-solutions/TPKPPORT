import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentsByFamilyId } from "@/lib/sharepoint";
import { mapFromSharePoint, STUDENT_FIELD_MAP } from "@/lib/field-maps";
import { Student } from "@/types/student";
import { StudentCard } from "@/components/student-card";

export default async function StudentsPage() {
  const session = await getSession();
  if (!session || !session.familyId) redirect("/login");

  const rawStudents = await getStudentsByFamilyId(session.familyId);

  const students: Student[] = rawStudents.map((raw) => ({
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(raw, STUDENT_FIELD_MAP),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          View and edit your child&apos;s details
        </p>
      </div>

      {students.length === 0 ? (
        <p className="text-muted-foreground">No students found for your family.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
