import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStudentsByFamilyId, createListItem } from "@/lib/sharepoint";
import {
  mapFromSharePoint,
  mapToSharePoint,
  STUDENT_FIELD_MAP,
} from "@/lib/field-maps";
import { Student } from "@/types/student";

// Fields a parent can set when enrolling a sibling
const ENROLL_FIELDS = [
  "firstName",
  "middleName",
  "lastName",
  "dateOfBirth",
  "gender",
  "mainstreamYearLevel",
  "mainstreamSchoolName",
  "otherSchoolPrevious",
  "otherSchoolName",
  "otherSchoolPast",
  "residencyStatus",
  "medicalCondition",
  "medicalDescription",
  "medication",
  "medicationDescription",
];

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

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.familyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  if (!body.firstName || !body.lastName || !body.dateOfBirth || !body.gender) {
    return NextResponse.json(
      { error: "First name, last name, date of birth, and gender are required." },
      { status: 400 }
    );
  }

  // Filter to only allowed enrollment fields
  const filtered = Object.fromEntries(
    Object.entries(body).filter(([key]) => ENROLL_FIELDS.includes(key))
  );

  // Add full name
  const fullName = [filtered.firstName, filtered.middleName, filtered.lastName]
    .filter(Boolean)
    .join(" ");

  const spFields = mapToSharePoint(
    { ...filtered, fullName },
    STUDENT_FIELD_MAP
  );

  // Link to the parent's family via the lookup field
  spFields["s_f_IDLookupId"] = session.familyId;

  // Set default enrollment status
  spFields["field_21"] = "Pending";

  const created = await createListItem(
    process.env.STUDENTS_LIST_ID!,
    spFields
  );

  return NextResponse.json(
    { success: true, id: created.id },
    { status: 201 }
  );
}
