import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getListItems } from "@/lib/sharepoint";
import { mapFromSharePoint, FAMILY_FIELD_MAP } from "@/lib/field-maps";
import { Family } from "@/types/family";
import { AdminFamiliesTable } from "./families-table";

export default async function AdminFamiliesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const rawFamilies = await getListItems(process.env.FAMILY_LIST_ID!);
  const families: Family[] = rawFamilies.map((raw) => ({
    id: raw.id as string,
    ...mapFromSharePoint<Omit<Family, "id">>(raw, FAMILY_FIELD_MAP),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Families</h1>
        <p className="text-muted-foreground">
          View and manage all registered families.
        </p>
      </div>

      <AdminFamiliesTable families={families} />
    </div>
  );
}
