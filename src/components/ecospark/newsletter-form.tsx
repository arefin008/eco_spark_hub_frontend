"use client";

import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { newsletterService } from "@/services/newsletter.service";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: newsletterService.subscribe,
    onSuccess: () => {
      toast.success("Subscribed to the EcoSpark Hub newsletter.");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(email);
      }}
    >
      <label className="flex h-14 flex-1 items-center gap-3 rounded-full border border-border/80 bg-background px-4 shadow-sm transition focus-within:border-primary/35 focus-within:ring-4 focus-within:ring-primary/10 sm:px-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:size-9">
          <Mail className="size-4" />
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email for updates"
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
        />
      </label>
      <Button size="lg" type="submit" disabled={mutation.isPending} className="sm:px-6">
        {mutation.isPending ? "Subscribing..." : "Join Newsletter"}
      </Button>
    </form>
  );
}
