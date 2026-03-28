"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/domain";

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("role", {
    header: "Role",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => formatDate(info.getValue()),
  }),
];

export function AdminUsersTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const usersQuery = useQuery({
    queryKey: ["admin-users", searchTerm],
    queryFn: () => adminService.users({ searchTerm, limit: 100 }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "DEACTIVATED" }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: async () => {
      toast.success("User status updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const table = useReactTable({
    data: usersQuery.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 px-6 py-10 lg:px-10">
      <div className="rounded-[28px] border border-border/80 bg-card p-6">
        <h1 className="text-3xl font-semibold tracking-tight">Member management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search users and activate or deactivate accounts.
        </p>
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or email"
          className="mt-5 h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none md:max-w-md"
        />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border/80 bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-4 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th className="px-4 py-4 font-semibold">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={row.original.status === "ACTIVE" || statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ id: row.original.id, status: "ACTIVE" })
                      }
                    >
                      Activate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        row.original.status === "DEACTIVATED" || statusMutation.isPending
                      }
                      onClick={() =>
                        statusMutation.mutate({
                          id: row.original.id,
                          status: "DEACTIVATED",
                        })
                      }
                    >
                      Deactivate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
