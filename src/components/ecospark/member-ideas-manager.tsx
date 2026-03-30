"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { categoryService } from "@/services/category.service";
import { ideaService, type IdeaInput } from "@/services/idea.service";
import type { Idea } from "@/types/domain";

const ideaSchema = z
  .object({
    title: z.string().min(3),
    problemStatement: z.string().min(10),
    proposedSolution: z.string().min(10),
    description: z.string().min(10),
    categoryId: z.string().min(1),
    isPaid: z.boolean(),
    price: z.number().optional(),
    mediaUrls: z.string(),
  })
  .superRefine((value, context) => {
    if (value.isPaid && (!value.price || value.price <= 0)) {
      context.addIssue({
        code: "custom",
        message: "Paid ideas require a positive price.",
        path: ["price"],
      });
    }
  });

function toPayload(value: z.infer<typeof ideaSchema>): IdeaInput {
  return {
    title: value.title,
    problemStatement: value.problemStatement,
    proposedSolution: value.proposedSolution,
    description: value.description,
    categoryId: value.categoryId,
    isPaid: value.isPaid,
    price: value.isPaid ? value.price : undefined,
    mediaUrls: value.mediaUrls
      ? value.mediaUrls
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined,
  };
}

export function MemberIdeasManager() {
  const queryClient = useQueryClient();
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const ideasQuery = useQuery({
    queryKey: ["ideas", "mine"],
    queryFn: ideaService.mine,
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories", "member-ideas"],
    queryFn: () => categoryService.list({ limit: 100 }),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      problemStatement: "",
      proposedSolution: "",
      description: "",
      categoryId: "",
      isPaid: false,
      price: undefined as number | undefined,
      mediaUrls: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = ideaSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid idea form.");
        return;
      }

      saveMutation.mutate(toPayload(parsed.data));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: IdeaInput) => {
      if (editingIdea) {
        return ideaService.update(editingIdea.id, payload);
      }
      return ideaService.create(payload);
    },
    onSuccess: async () => {
      toast.success(editingIdea ? "Idea updated." : "Idea draft created.");
      setEditingIdea(null);
      await queryClient.invalidateQueries({ queryKey: ["ideas", "mine"] });
      form.reset();
    },
    onError: (error) => toast.error(error.message),
  });

  const submitMutation = useMutation({
    mutationFn: ideaService.submit,
    onSuccess: async () => {
      toast.success("Idea submitted for review.");
      await queryClient.invalidateQueries({ queryKey: ["ideas", "mine"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ideaService.remove,
    onSuccess: async () => {
      toast.success("Idea deleted.");
      await queryClient.invalidateQueries({ queryKey: ["ideas", "mine"] });
    },
    onError: (error) => toast.error(error.message),
  });

  function hydrateIdeaForm(idea: Idea) {
    setEditingIdea(idea);
    form.setFieldValue("title", idea.title);
    form.setFieldValue("problemStatement", idea.problemStatement);
    form.setFieldValue("proposedSolution", idea.proposedSolution);
    form.setFieldValue("description", idea.description);
    form.setFieldValue("categoryId", idea.category.id);
    form.setFieldValue("isPaid", idea.isPaid);
    form.setFieldValue("price", idea.isPaid ? Number(idea.price) : undefined);
    form.setFieldValue("mediaUrls", idea.media.map((media) => media.url).join(", "));
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">
              {editingIdea ? "Edit draft" : "Create a new idea"}
            </CardTitle>
            <CardDescription>
              Draft first, then submit for admin review when the proposal is ready.
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
            <form.Field name="title">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Idea title"
                />
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => (
                <select
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="h-12 rounded-2xl border border-border bg-background px-4 outline-none"
                >
                  <option value="">Select a category</option>
                  {categoriesQuery.data?.data.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </form.Field>

            <form.Field name="problemStatement">
              {(field) => (
                <Textarea
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Problem statement"
                  className="min-h-24"
                />
              )}
            </form.Field>

            <form.Field name="proposedSolution">
              {(field) => (
                <Textarea
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Proposed solution"
                  className="min-h-24"
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Textarea
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Detailed description"
                />
              )}
            </form.Field>

            <form.Field name="mediaUrls">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Image URLs separated by commas"
                />
              )}
            </form.Field>

            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <form.Field name="isPaid">
                {(field) => (
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(event) => field.handleChange(event.target.checked)}
                    />
                    <span className="text-sm font-medium">This is a paid idea</span>
                  </label>
                )}
              </form.Field>

              <form.Field name="price">
                {(field) => (
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value ?? ""}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value ? Number(event.target.value) : undefined,
                      )
                    }
                    placeholder="Price"
                  />
                )}
              </form.Field>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending
                  ? "Saving..."
                  : editingIdea
                    ? "Update Idea"
                    : "Save Draft"}
              </Button>
              {editingIdea ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingIdea(null);
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
          {(ideasQuery.data ?? []).map((idea) => (
            <article key={idea.id} className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    {idea.status.replaceAll("_", " ")}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{idea.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {idea.category.name} • {formatDate(idea.createdAt)}
                  </p>
                  {idea.isPaid ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Paid idea at {formatCurrency(idea.price)}
                    </p>
                  ) : null}
                </div>
              </div>

              {idea.rejectionReason ? (
                <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  Rejection reason: {idea.rejectionReason}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {idea.status !== "APPROVED" ? (
                  <Button
                    variant="outline"
                    onClick={() => hydrateIdeaForm(idea)}
                    className="w-full sm:w-auto"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                ) : null}
                {idea.status === "DRAFT" || idea.status === "REJECTED" ? (
                  <Button
                    onClick={() => submitMutation.mutate(idea.id)}
                    className="w-full sm:w-auto"
                  >
                    <Send className="size-4" />
                    Submit for Review
                  </Button>
                ) : null}
                {idea.status !== "APPROVED" ? (
                  <Button
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(idea.id)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
