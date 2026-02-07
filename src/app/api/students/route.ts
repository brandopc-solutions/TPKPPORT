import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStudentsByFamilyId } from "@/lib/sharepoint";
import { mapFromSharePoint, STUDENT_FIELD_MAP } from "@/lib/field-maps";
import { Student } from "@/types/student";

export async function GET() {
  const session = await getSession();
  if (!session || !session.familyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawStudents = await getStudentsByFamilyId(session.familyId);
  const students: Student[] = rawStudents.map((raw) => ({
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(raw, STUDENT_FIELD_MAP),
  }));

  return NextResponse.json(students);
}
