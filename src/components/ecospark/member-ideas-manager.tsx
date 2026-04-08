"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Send, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getDraftAssist } from "@/lib/ai";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { aiService } from "@/services/ai.service";
import { categoryService } from "@/services/category.service";
import { ideaService, type IdeaInput } from "@/services/idea.service";
import type { Idea } from "@/types/domain";
import type { GeminiDraftAssistResponse } from "@/types/gemini";

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
  const [generatedDraft, setGeneratedDraft] = useState<GeminiDraftAssistResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof ideaSchema>, string>>>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");
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
        setSuccessMessage("");
        setErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<keyof z.infer<typeof ideaSchema>, string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid idea form.");
        return;
      }

      setErrors({});
      saveMutation.mutate(toPayload(parsed.data));
    },
  });
  const selectedCategoryName =
    categoriesQuery.data?.data.find((category) => category.id === form.state.values.categoryId)?.name;
  const draftAssist = useMemo(
    () =>
      getDraftAssist({
        title: form.state.values.title,
        categoryName: selectedCategoryName,
        problemStatement: form.state.values.problemStatement,
        proposedSolution: form.state.values.proposedSolution,
        description: form.state.values.description,
        isPaid: form.state.values.isPaid,
      }),
    [
      form.state.values.categoryId,
      form.state.values.description,
      form.state.values.isPaid,
      form.state.values.problemStatement,
      form.state.values.proposedSolution,
      form.state.values.title,
      selectedCategoryName,
    ],
  );
  const draftAssistMutation = useMutation({
    mutationFn: () =>
      aiService.draftAssist({
        title: form.state.values.title,
        categoryName: selectedCategoryName,
        problemStatement: form.state.values.problemStatement,
        proposedSolution: form.state.values.proposedSolution,
        description: form.state.values.description,
        isPaid: form.state.values.isPaid,
      }),
    onSuccess: (nextDraft) => {
      setGeneratedDraft(nextDraft);
      setSuccessMessage("Gemini draft suggestions generated.");
      toast.success("Gemini draft ready.");
      form.setFieldValue("title", nextDraft.title);
      form.setFieldValue("problemStatement", nextDraft.problemStatement);
      form.setFieldValue("proposedSolution", nextDraft.proposedSolution);
      form.setFieldValue("description", nextDraft.description);
      form.setFieldValue("mediaUrls", nextDraft.mediaUrls);

      if (form.state.values.isPaid) {
        form.setFieldValue("price", nextDraft.price);
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: IdeaInput) => {
      if (editingIdea) {
        return ideaService.update(editingIdea.id, payload);
      }
      return ideaService.create(payload);
    },
    onSuccess: async () => {
      setSuccessMessage(editingIdea ? "Idea draft updated successfully." : "Idea draft saved successfully.");
      toast.success(editingIdea ? "Idea updated." : "Idea draft created.");
      setEditingIdea(null);
      setGeneratedDraft(null);
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
    setSuccessMessage("");
    setErrors({});
    setGeneratedDraft(null);
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

  function applyDraftAssist() {
    draftAssistMutation.mutate();
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
            {successMessage ? <p className="ui-status-success">{successMessage}</p> : null}

            <div className="rounded-[24px] border border-emerald-600/15 bg-emerald-600/8 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    <Sparkles className="size-3.5" />
                    Smart form autofill
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Readiness score: {draftAssist.readinessScore}/100. The assistant can fill missing structure and tighten the proposal framing.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={applyDraftAssist} disabled={draftAssistMutation.isPending}>
                  <WandSparkles className="size-4" />
                  {draftAssistMutation.isPending ? "Generating..." : "Apply Gemini Draft"}
                </Button>
              </div>
              <div className="mt-4 grid gap-2">
                {(generatedDraft?.reasons ?? draftAssist.reasons).map((reason) => (
                  <p key={reason} className="text-sm text-muted-foreground">
                    {reason}
                  </p>
                ))}
              </div>
            </div>

            <form.Field name="title">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Idea title</span>
                  <Input
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Idea title"
                    aria-invalid={Boolean(errors.title)}
                  />
                  {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
                </label>
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="ui-control"
                    aria-invalid={Boolean(errors.categoryId)}
                  >
                    <option value="">Select a category</option>
                    {categoriesQuery.data?.data.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId ? (
                    <p className="text-sm text-destructive">{errors.categoryId}</p>
                  ) : null}
                </label>
              )}
            </form.Field>

            <form.Field name="problemStatement">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Problem statement</span>
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Problem statement"
                    className="min-h-24"
                    aria-invalid={Boolean(errors.problemStatement)}
                  />
                  {errors.problemStatement ? (
                    <p className="text-sm text-destructive">{errors.problemStatement}</p>
                  ) : null}
                </label>
              )}
            </form.Field>

            <form.Field name="proposedSolution">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Proposed solution</span>
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Proposed solution"
                    className="min-h-24"
                    aria-invalid={Boolean(errors.proposedSolution)}
                  />
                  {errors.proposedSolution ? (
                    <p className="text-sm text-destructive">{errors.proposedSolution}</p>
                  ) : null}
                </label>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Detailed description</span>
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Detailed description"
                    aria-invalid={Boolean(errors.description)}
                  />
                  {errors.description ? (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  ) : null}
                </label>
              )}
            </form.Field>

            <form.Field name="mediaUrls">
              {(field) => (
                <label className="space-y-2">
                  <span className="text-sm font-medium">Media URLs</span>
                  <Input
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Image URLs separated by commas"
                    aria-invalid={Boolean(errors.mediaUrls)}
                  />
                  {errors.mediaUrls ? (
                    <p className="text-sm text-destructive">{errors.mediaUrls}</p>
                  ) : null}
                </label>
              )}
            </form.Field>

            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <form.Field name="isPaid">
                {(field) => (
                  <label className="ui-control flex items-center gap-3 self-end">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(event) => field.handleChange(event.target.checked)}
                    />
                    <span className="text-sm font-medium">This is a paid idea</span>
                  </label>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.values.isPaid}>
                {(isPaid) =>
                  isPaid ? (
                    <form.Field name="price">
                      {(field) => (
                        <label className="space-y-2">
                          <span className="text-sm font-medium">Price</span>
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
                            aria-invalid={Boolean(errors.price)}
                          />
                          {errors.price ? <p className="text-sm text-destructive">{errors.price}</p> : null}
                        </label>
                      )}
                    </form.Field>
                  ) : null
                }
              </form.Subscribe>
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
                      setSuccessMessage("");
                      setErrors({});
                      setGeneratedDraft(null);
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
          <article className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <Sparkles className="size-3.5" />
              AI content suggestions
            </p>
            <h2 className="mt-3 text-xl font-semibold">Suggested draft direction</h2>
            <p className="mt-2 text-sm text-muted-foreground">Category hint: {generatedDraft?.categoryHint ?? draftAssist.categoryHint}</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{generatedDraft?.description ?? draftAssist.description}</p>
          </article>

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
                <p className="ui-status-error mt-4">
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
