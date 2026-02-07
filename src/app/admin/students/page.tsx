import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getListItems } from "@/lib/sharepoint";
import { mapFromSharePoint, STUDENT_FIELD_MAP } from "@/lib/field-maps";
import { Student } from "@/types/student";
import { AdminStudentsTable } from "./students-table";

export default async function AdminStudentsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const rawStudents = await getListItems(process.env.STUDENTS_LIST_ID!);
  const students: Student[] = rawStudents.map((raw) => ({
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(raw, STUDENT_FIELD_MAP),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Students</h1>
        <p className="text-muted-foreground">
          View and manage all enrolled students.
        </p>
      </div>

      <AdminStudentsTable students={students} />
    </div>
  );
}
