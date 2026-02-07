"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Family } from "@/types/family";
import { Badge } from "@/components/ui/badge";

interface AdminFamiliesTableProps {
  families: Family[];
}

export function AdminFamiliesTable({ families }: AdminFamiliesTableProps) {
  const router = useRouter();

  return (
    <DataTable
      data={families}
      searchFields={["p1FirstName", "p1LastName", "p2FirstName", "p2LastName", "p1Email", "title"]}
      columns={[
        { header: "Family ID", accessor: "title" },
        {
          header: "Parent 1",
          accessor: (row) => `${row.p1FirstName} ${row.p1LastName}`,
        },
        { header: "P1 Email", accessor: "p1Email" },
        {
          header: "Parent 2",
          accessor: (row) =>
            row.p2FirstName ? `${row.p2FirstName} ${row.p2LastName}` : "-",
        },
        { header: "Children", accessor: "numberOfChildren" },
        {
          header: "Status",
          accessor: (row) => (
            <Badge variant={row.status === "Active" ? "default" : "secondary"}>
              {row.status || "Unknown"}
            </Badge>
          ),
        },
      ]}
      onRowClick={(row) => router.push(`/admin/families/${row.id}`)}
    />
  );
}
