"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchFields?: (keyof T)[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchFields = [],
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? data.filter((row) =>
        searchFields.some((field) => {
          const value = row[field];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
          );
        })
      )
    : data;

  const getCellValue = (row: T, col: Column<T>) => {
    if (typeof col.accessor === "function") {
      return col.accessor(row);
    }
    const val = row[col.accessor];
    return val != null ? String(val) : "";
  };

  return (
    <div className="space-y-4">
      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow
                  key={row.id}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, i) => (
                    <TableCell key={i}>{getCellValue(row, col)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {data.length} records
      </p>
    </div>
  );
}
