import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getListItem, updateListItem } from "@/lib/sharepoint";
import {
  mapFromSharePoint,
  mapToSharePoint,
  FAMILY_FIELD_MAP,
} from "@/lib/field-maps";
import { Family } from "@/types/family";

// Editable fields for parents (prevent modifying status, accounting, etc.)
const PARENT_EDITABLE_FIELDS = [
  "p1FirstName", "p1MiddleName", "p1LastName", "p1Mobile", "p1Email", "p1Relationship",
  "p1Street", "p1Suburb", "p1State", "p1PostCode", "p1Country",
  "p2FirstName", "p2MiddleName", "p2LastName", "p2Mobile", "p2Email", "p2Relationship",
  "emergencyFirstName", "emergencyMiddleName", "emergencyLastName",
  "emergencyMobile", "emergencyRelation",
  "allowPhoto", "photoSharing",
];

export async function GET() {
  const session = await getSession();
  if (!session || !session.familyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await getListItem(process.env.FAMILY_LIST_ID!, session.familyId);
  const family: Family = {
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Family, "id">>(raw, FAMILY_FIELD_MAP),
  };

  return NextResponse.json(family);
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.familyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Filter to only editable fields
  const allowedFields = session.role === "admin"
    ? body // Admins can edit all fields
    : Object.fromEntries(
        Object.entries(body).filter(([key]) =>
          PARENT_EDITABLE_FIELDS.includes(key)
        )
      );

  // Map to SharePoint field names
  const spFields = mapToSharePoint(allowedFields, FAMILY_FIELD_MAP);

  await updateListItem(
    process.env.FAMILY_LIST_ID!,
    session.familyId,
    spFields
  );

  return NextResponse.json({ success: true });
}
