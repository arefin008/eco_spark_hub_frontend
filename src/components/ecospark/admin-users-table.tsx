"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
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
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const usersQuery = useQuery({
    queryKey: ["admin-users", searchTerm, roleFilter, statusFilter, page, limit],
    queryFn: () =>
      adminService.users({
        searchTerm: searchTerm || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        limit,
      }),
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

  const totalRows = usersQuery.data?.meta?.total ?? usersQuery.data?.data.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / limit));
  const resultsLabelStart = totalRows ? (page - 1) * limit + 1 : 0;
  const resultsLabelEnd = Math.min(page * limit, totalRows);

  const mobileCards = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-[28px] border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">User management</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Filter, page, and manage user accounts from a single table.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input
              value={searchTerm}
              onChange={(event) => {
                setPage(1);
                setSearchTerm(event.target.value);
              }}
              placeholder="Search by name or email"
              className="ui-control h-11 min-w-0 xl:w-64"
            />
            <select
              value={roleFilter}
              onChange={(event) => {
                setPage(1);
                setRoleFilter(event.target.value);
              }}
              className="ui-control h-11"
            >
              <option value="ALL">All roles</option>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
              className="ui-control h-11"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
            <select
              value={String(limit)}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
              className="ui-control h-11"
            >
              <option value="10">10 rows</option>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {mobileCards.length ? (
          mobileCards.map((user) => (
            <article key={user.id} className="rounded-[24px] border border-border/80 bg-card p-5 shadow-sm">
              <div className="space-y-2">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="break-all text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.role} • {user.status} • {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={`/dashboard/admin/users/${user.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Details
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={user.status === "ACTIVE" || statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: user.id, status: "ACTIVE" })}
                >
                  Activate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  disabled={user.status === "DEACTIVATED" || statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: user.id, status: "DEACTIVATED" })}
                >
                  Deactivate
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-border/80 bg-card p-6 text-sm text-muted-foreground shadow-sm">
            No users matched the current filters.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-border/80 bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-muted/45">
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/dashboard/admin/users/${row.original.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
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
                          disabled={row.original.status === "DEACTIVATED" || statusMutation.isPending}
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No users matched the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-border/80 bg-card px-5 py-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Showing {resultsLabelStart} - {resultsLabelEnd} of {totalRows} users
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
