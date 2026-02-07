import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getListItem, updateListItem } from "@/lib/sharepoint";
import {
  mapFromSharePoint,
  mapToSharePoint,
  STUDENT_FIELD_MAP,
} from "@/lib/field-maps";
import { Student } from "@/types/student";

// Editable fields for parents
const PARENT_EDITABLE_STUDENT_FIELDS = [
  "firstName", "middleName", "lastName", "dateOfBirth", "gender",
  "mainstreamYearLevel", "mainstreamSchoolName",
  "otherSchoolPrevious", "otherSchoolName", "otherSchoolPast",
  "residencyStatus",
  "medicalCondition", "medicalDescription",
  "medication", "medicationDescription",
];

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await getListItem(process.env.STUDENTS_LIST_ID!, id);

  // Parent can only access their own family's students
  if (session.role === "parent") {
    const studentFamilyId = raw.s_f_IDLookupId as string;
    if (studentFamilyId !== session.familyId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const student: Student = {
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Student, "id">>(raw, STUDENT_FIELD_MAP),
  };

  return NextResponse.json(student);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership for parents
  if (session.role === "parent") {
    const raw = await getListItem(process.env.STUDENTS_LIST_ID!, id);
    const studentFamilyId = raw.s_f_IDLookupId as string;
    if (studentFamilyId !== session.familyId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const body = await request.json();

  // Filter to only editable fields
  const allowedFields = session.role === "admin"
    ? body
    : Object.fromEntries(
        Object.entries(body).filter(([key]) =>
          PARENT_EDITABLE_STUDENT_FIELDS.includes(key)
        )
      );

  const spFields = mapToSharePoint(allowedFields, STUDENT_FIELD_MAP);

  await updateListItem(process.env.STUDENTS_LIST_ID!, id, spFields);

  return NextResponse.json({ success: true });
}
