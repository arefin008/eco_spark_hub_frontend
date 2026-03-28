"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email."),
  role: z.enum(["MEMBER", "ADMIN"]),
  status: z.enum(["ACTIVE", "DEACTIVATED"]),
});

export function AdminUserDetail({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => userService.byId(userId),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "MEMBER" as const,
      status: "ACTIVE" as const,
    },
    onSubmit: async ({ value }) => {
      const parsed = userSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid user form.");
        return;
      }

      updateMutation.mutate(parsed.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: z.infer<typeof userSchema>) => userService.update(userId, payload),
    onSuccess: async () => {
      toast.success("User updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: "ACTIVE" | "DEACTIVATED" }) =>
      adminService.updateUserStatus(userId, status),
    onSuccess: async () => {
      toast.success("User status updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const user = userQuery.data;

  useEffect(() => {
    if (!user || updateMutation.isPending) {
      return;
    }

    form.setFieldValue("name", user.name);
    form.setFieldValue("email", user.email);
    form.setFieldValue("role", user.role);
    form.setFieldValue("status", user.status);
  }, [form, updateMutation.isPending, user]);

  if (userQuery.isLoading) {
    return <div className="px-4 py-8 text-muted-foreground sm:px-6 lg:px-10">Loading user...</div>;
  }

  if (!user) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-[28px] border border-border/80 bg-card p-8">
          <h1 className="text-3xl font-semibold">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Admin users
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {user.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
        <Link
          href="/dashboard/admin/users"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl px-4")}
        >
          Back to Users
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Edit account</CardTitle>
            <CardDescription>
              Update name, email, role, and account state for this user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <form.Field name="name">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Full name"
                  />
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Email"
                  />
                )}
              </form.Field>

              <div className="grid gap-4 md:grid-cols-2">
                <form.Field name="role">
                  {(field) => (
                    <select
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value as "MEMBER" | "ADMIN")
                      }
                      className="h-12 rounded-2xl border border-border bg-background px-4 outline-none"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  )}
                </form.Field>

                <form.Field name="status">
                  {(field) => (
                    <select
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value as "ACTIVE" | "DEACTIVATED")
                      }
                      className="h-12 rounded-2xl border border-border bg-background px-4 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DEACTIVATED">DEACTIVATED</option>
                    </select>
                  )}
                </form.Field>
              </div>

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Quick actions</CardTitle>
            <CardDescription>
              Apply common admin actions without changing the full profile form.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-border/70 bg-background/70 p-5">
              <p className="text-sm text-muted-foreground">Current role</p>
              <p className="mt-1 text-xl font-semibold">{user.role}</p>
            </div>
            <div className="rounded-[24px] border border-border/70 bg-background/70 p-5">
              <p className="text-sm text-muted-foreground">Current status</p>
              <p className="mt-1 text-xl font-semibold">{user.status}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                disabled={user.status === "ACTIVE" || statusMutation.isPending}
                onClick={() => statusMutation.mutate({ status: "ACTIVE" })}
              >
                Activate
              </Button>
              <Button
                variant="ghost"
                disabled={user.status === "DEACTIVATED" || statusMutation.isPending}
                onClick={() => statusMutation.mutate({ status: "DEACTIVATED" })}
              >
                Deactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
