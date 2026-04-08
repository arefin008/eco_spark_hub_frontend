"use client";

import { useMutation } from "@tanstack/react-query";
import { MailMinus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { PageShell } from "@/components/ecospark/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterService } from "@/services/newsletter.service";

const unsubscribeSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export function NewsletterUnsubscribeCard({ initialEmail }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const mutation = useMutation({
    mutationFn: newsletterService.unsubscribe,
    onSuccess: () => {
      setSuccessMessage("This email address has been removed from newsletter delivery.");
      setError("");
      toast.success("You have been unsubscribed.");
    },
    onError: (error) => {
      setSuccessMessage("");
      toast.error(error.message);
    },
  });

  return (
    <PageShell className="py-12 md:py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <MailMinus className="size-7" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Unsubscribe from newsletter
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          Enter your email address to stop receiving platform updates, top-voted ideas, and
          announcements.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = unsubscribeSchema.safeParse({ email: email.trim() });

            if (!parsed.success) {
              setSuccessMessage("");
              setError(parsed.error.issues[0]?.message || "Enter a valid email address.");
              return;
            }

            setError("");
            mutation.mutate(parsed.data.email);
          }}
          noValidate
        >
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your-email@example.com"
            aria-invalid={Boolean(error)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {successMessage ? <p className="ui-status-success">{successMessage}</p> : null}
          <Button type="submit" disabled={mutation.isPending || !email.trim()}>
            {mutation.isPending ? "Unsubscribing..." : "Unsubscribe"}
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
