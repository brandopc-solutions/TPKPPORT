import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getListItem } from "@/lib/sharepoint";
import { mapFromSharePoint, FAMILY_FIELD_MAP } from "@/lib/field-maps";
import { Family } from "@/types/family";
import { FamilyForm } from "@/components/family-form";

export default async function FamilyPage() {
  const session = await getSession();
  if (!session || !session.familyId) redirect("/login");

  const rawFamily = await getListItem(
    process.env.FAMILY_LIST_ID!,
    session.familyId
  );

  const family: Family = {
    id: rawFamily.id as string,
    ...mapFromSharePoint<Omit<Family, "id">>(rawFamily, FAMILY_FIELD_MAP),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Family</h1>
        <p className="text-muted-foreground">
          Update your family and contact information below.
        </p>
      </div>

      <FamilyForm family={family} />
    </div>
  );
}
