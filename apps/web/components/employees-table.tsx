"use client";

import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import { NewEmployeeDrawer } from "@/components/forms/employee-drawers";
import { UserRole } from "@/lib/model/auth";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      const nameParts = row.original.name.split(" ");
      const firstInitial = nameParts[0]?.[0] || "";
      const lastInitial = (nameParts.length >= 2 && nameParts[nameParts.length - 1]?.[0]) || "";
      const initials = nameParts.length >= 2 ? `${firstInitial}${lastInitial}` : firstInitial;
      return (
        <Avatar>
          <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p className="text-foreground text-left">{row.original.name}</p>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: () => <div className="w-full text-center">Role</div>,
    cell: ({ row }) => (
      <div className="flex flex-1">
        <Badge variant="secondary" className="mx-auto text-muted-foreground px-1.5">
          {row.original.role.toUpperCase()}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="w-full">Email</div>,
  },
];

function ExpandableRow({ row }: { row: Row<Employee> }) {
  return (
    <>
      <TableRow className="relative z-0">
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    </>
  );
}

export function EmployeesTable({ data }: { data: Employee[] }) {
  const table = useReactTable({
    data,
    columns: columns,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
        <NewEmployeeDrawer />
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ?
                table.getRowModel().rows.map((row) => <ExpandableRow key={row.id} row={row} />)
              : <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
