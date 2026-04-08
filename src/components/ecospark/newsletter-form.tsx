"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getNewsletterRecommendations } from "@/lib/ai";
import { ideaService } from "@/services/idea.service";
import { newsletterService } from "@/services/newsletter.service";

const newsletterSchema = z.object({
  email: z.email("Enter a valid email address."),
});

const emailProviders = ["gmail.com", "outlook.com", "yahoo.com"] as const;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const ideasQuery = useQuery({
    queryKey: ["ideas", "newsletter-recommendations"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "TOP_VOTED" }),
  });
  const newsletterRecommendations = useMemo(
    () => getNewsletterRecommendations(ideasQuery.data?.data ?? []),
    [ideasQuery.data?.data],
  );
  const normalizedEmailInput = email.replace(/\s+/g, "").toLowerCase();
  const [localPart, providedDomain = ""] = normalizedEmailInput.split("@");
  const emailDomainSuggestions = Boolean(localPart)
    ? emailProviders
        .filter(
          (domain) =>
            !normalizedEmailInput.includes("@") ||
            (domain.startsWith(providedDomain) && providedDomain !== domain),
        )
        .map((domain) => `${localPart}@${domain}`)
        .slice(0, 3)
    : [];

  const mutation = useMutation({
    mutationFn: newsletterService.subscribe,
    onSuccess: () => {
      setSuccessMessage("Subscription confirmed. Future updates will be sent to this address.");
      setError("");
      setEmail("");
      toast.success("Subscribed to the EcoSpark Hub newsletter.");
    },
    onError: (error) => {
      setSuccessMessage("");
      toast.error(error.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = newsletterSchema.safeParse({ email: email.trim() });

    if (!parsed.success) {
      setSuccessMessage("");
      setError(parsed.error.issues[0]?.message || "Enter a valid email address.");
      return;
    }

    setError("");
    mutation.mutate(parsed.data.email);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit} noValidate>
      {newsletterRecommendations.length ? (
        <div className="rounded-[24px] border border-emerald-600/12 bg-[linear-gradient(180deg,rgba(22,163,74,0.05),rgba(255,255,255,0.82))] p-4 dark:border-emerald-500/15 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(15,23,42,0.92))]">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            <Sparkles className="size-3.5" />
            Smart newsletter recommendations
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {newsletterRecommendations.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  setSuccessMessage(`Recommendation saved: prioritize ${item.topic} updates around "${item.title}".`)
                }
                className="rounded-full border border-emerald-600/12 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-600/22 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/20 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
              >
                {item.topic}: {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <label className="ui-control flex h-14 items-center gap-3 pl-4 pr-1.5 sm:pl-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Mail className="size-4" />
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email for updates"
          aria-invalid={Boolean(error)}
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
        />
        <Button size="lg" type="submit" disabled={mutation.isPending} className="shrink-0 rounded-full px-5 sm:px-6">
          {mutation.isPending ? "Subscribing..." : "Join Newsletter"}
        </Button>
      </label>

      {emailDomainSuggestions.length ? (
        <div className="flex flex-wrap gap-2">
          {emailDomainSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setEmail(suggestion)}
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Autofill suggestion: {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {successMessage ? <p className="ui-status-success">{successMessage}</p> : null}
    </form>
  );
}
