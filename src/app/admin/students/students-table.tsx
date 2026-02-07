"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Student } from "@/types/student";
import { Badge } from "@/components/ui/badge";

interface AdminStudentsTableProps {
  students: Student[];
}

export function AdminStudentsTable({ students }: AdminStudentsTableProps) {
  const router = useRouter();

  return (
    <DataTable
      data={students}
      searchFields={["firstName", "lastName", "currentClass", "campus", "rollNumber"]}
      columns={[
        { header: "Roll No", accessor: "rollNumber" },
        {
          header: "Name",
          accessor: (row) => `${row.firstName} ${row.lastName}`,
        },
        { header: "Campus", accessor: "campus" },
        { header: "Class", accessor: "currentClass" },
        { header: "Year Level", accessor: "mainstreamYearLevel" },
        {
          header: "Enrollment",
          accessor: (row) => (
            <Badge
              variant={row.enrollmentStatus === "Enrolled" ? "default" : "secondary"}
            >
              {row.enrollmentStatus || "Unknown"}
            </Badge>
          ),
        },
        {
          header: "Status",
          accessor: (row) => (
            <Badge
              variant={row.status === "Active" ? "default" : "secondary"}
            >
              {row.status || "Unknown"}
            </Badge>
          ),
        },
      ]}
      onRowClick={(row) => router.push(`/admin/students/${row.id}`)}
    />
  );
}
