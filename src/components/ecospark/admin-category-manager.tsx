"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/helpers";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/domain";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  description: z.string().optional(),
});

export function AdminCategoryManager() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoryService.list({ limit: 100 }),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = categorySchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid category form.");
        return;
      }

      saveMutation.mutate(parsed.data);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: z.infer<typeof categorySchema>) => {
      if (editingCategory) {
        return categoryService.update(editingCategory.id, payload);
      }

      return categoryService.create(payload);
    },
    onSuccess: async () => {
      toast.success(editingCategory ? "Category updated." : "Category created.");
      setEditingCategory(null);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.remove,
    onSuccess: async () => {
      toast.success("Category removed.");
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(error.message),
  });

  function hydrateForm(category: Category) {
    setEditingCategory(category);
    form.setFieldValue("name", category.name);
    form.setFieldValue("description", category.description ?? "");
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">
              {editingCategory ? "Edit category" : "Create category"}
            </CardTitle>
            <CardDescription>
              Manage the category list that members use when creating ideas.
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
                    placeholder="Category name"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Short category description"
                    className="min-h-28"
                  />
                )}
              </form.Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </Button>
                {editingCategory ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(null);
                      form.reset();
                    }}
                  >
                    Cancel Edit
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {(categoriesQuery.data?.data ?? []).map((category) => (
            <article
              key={category.id}
              className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold sm:text-2xl">{category.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Created {formatDate(category.createdAt)}
                  </p>
                  {category.description ? (
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {category.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button variant="outline" onClick={() => hydrateForm(category)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
